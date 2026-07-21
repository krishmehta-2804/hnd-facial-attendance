import { useState, useMemo, useEffect } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { demoSchool } from '../services/demoData';
import { format, parseISO } from 'date-fns';
import { UtensilsCrossed, Users, Calendar, Calculator, Landmark, Check } from 'lucide-react';

const MealPlanningPage = () => {
  const { students, records } = useAttendance();

  // Selected date defaults to today (format: yyyy-MM-dd)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for the selected date
  const [mealsOrdered, setMealsOrdered] = useState('');
  const [chapatis, setChapatis] = useState('');
  const [rice, setRice] = useState('');
  const [daal, setDaal] = useState('');
  const [sabji, setSabji] = useState('');

  // Load all meal logs from localStorage
  const [mealLogs, setMealLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('hnd_global_meal_logs');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Calculate total present students for the selected date (excluding dropouts)
  const presentStudentsCount = useMemo(() => {
    const activeStudentIds = new Set(
      students.filter((s) => s.status !== 'dropout').map((s) => s.id)
    );
    return records.filter(
      (r) => r.date === selectedDate && r.status === 'present' && activeStudentIds.has(r.studentId)
    ).length;
  }, [records, students, selectedDate]);

  // Synchronize input fields when the selected date changes
  useEffect(() => {
    const log = mealLogs[selectedDate] || {};
    setMealsOrdered(log.mealsOrdered !== undefined ? log.mealsOrdered : '');
    setChapatis(log.chapatis !== undefined ? log.chapatis : '');
    setRice(log.rice !== undefined ? log.rice : '');
    setDaal(log.daal !== undefined ? log.daal : '');
    setSabji(log.sabji !== undefined ? log.sabji : '');
  }, [selectedDate, mealLogs]);

  // Handle Form Submission / Save
  const handleSave = (e) => {
    e.preventDefault();
    const newLog = {
      date: selectedDate,
      mealsOrdered: parseInt(mealsOrdered) || 0,
      chapatis: parseInt(chapatis) || 0,
      rice: parseFloat(rice) || 0,
      daal: parseFloat(daal) || 0,
      sabji: parseFloat(sabji) || 0
    };

    const updatedLogs = {
      ...mealLogs,
      [selectedDate]: newLog
    };

    setMealLogs(updatedLogs);
    localStorage.setItem('hnd_global_meal_logs', JSON.stringify(updatedLogs));

    setSuccessMsg('Meal record saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Format averages per student (kg converts to grams for clear readability)
  const getAverageDisplay = (value, unit) => {
    if (!presentStudentsCount || !value) return `0 ${unit === 'kg' ? 'grams' : 'pieces'}`;
    const average = value / presentStudentsCount;
    if (unit === 'kg') {
      const grams = average * 1000;
      return `${grams.toFixed(1)} grams`;
    }
    return `${average.toFixed(2)} pieces`;
  };

  // Compile history array sorted descending by date
  const sortedHistory = useMemo(() => {
    return Object.values(mealLogs).sort((a, b) => b.date.localeCompare(a.date));
  }, [mealLogs]);

  // Selected date human label
  const formattedDateLabel = useMemo(() => {
    try {
      return format(parseISO(selectedDate), 'dd MMMM yyyy');
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1>Mid-Day Meal Tracker</h1>
          <p>{demoSchool.name} · School-wide portion average & cost coordinator</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <Calendar size={16} style={{ color: 'var(--accent)' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text)', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Grid container for input form and student portion summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        
        {/* Left Side Form - Meal Portions Entry */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <div className="card-header" style={{ marginBottom: 'var(--space-lg)' }}>
            <div>
              <div className="card-title">School-wide Food Entry</div>
              <div className="card-subtitle">Enter the total food ingredients prepared for {formattedDateLabel}</div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Total Meals Ordered/Cooked</label>
                <input
                  type="number"
                  placeholder="e.g. 140"
                  value={mealsOrdered}
                  onChange={(e) => setMealsOrdered(e.target.value)}
                  style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Total Chapatis Prepared (pcs)</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={chapatis}
                  onChange={(e) => setChapatis(e.target.value)}
                  style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Rice Prepared (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.0"
                  value={rice}
                  onChange={(e) => setRice(e.target.value)}
                  style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Daal Prepared (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.0"
                  value={daal}
                  onChange={(e) => setDaal(e.target.value)}
                  style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Sabji Prepared (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.0"
                  value={sabji}
                  onChange={(e) => setSabji(e.target.value)}
                  style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-sm)', alignSelf: 'flex-start' }}>
              Save Food Entry
            </button>
          </form>
        </div>

        {/* Right Side Card - portion share & cost results */}
        <div className="card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ marginBottom: 'var(--space-md)' }}>
              <div>
                <div className="card-title">Student Share & Cost Averages</div>
                <div className="card-subtitle">Real-time calculations for present roster</div>
              </div>
            </div>

            {/* Portions shares */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Sabji per student:</span>
                <span style={{ fontWeight: 700, color: 'var(--danger-light)' }}>{getAverageDisplay(sabji, 'kg')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Rice per student:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{getAverageDisplay(rice, 'kg')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Daal per student:</span>
                <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{getAverageDisplay(daal, 'kg')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Chapatis per student:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{getAverageDisplay(chapatis, 'pcs')}</span>
              </div>
            </div>
          </div>

          {/* Cost details (from user checkboxes) */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
              <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Landmark size={12} /> Cost Per Student:</span>
              <span style={{ fontWeight: 600 }}>₹34.50</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
              <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Calculator size={12} /> Total Meals Ordered:</span>
              <span style={{ fontWeight: 600 }}>{mealsOrdered || 0} meals</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Cost of Order:</span>
              <span style={{ color: 'var(--accent-light)' }}>₹{((parseInt(mealsOrdered) || 0) * 34.5).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', paddingTop: '4px' }}>
              <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> Present Students Count:</span>
              <span style={{ fontWeight: 600 }}>{presentStudentsCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-md)', fontWeight: 700, paddingTop: '4px' }}>
              <span style={{ color: 'var(--text)' }}>Effective Cost of Present:</span>
              <span style={{ color: 'var(--success)' }}>₹{(presentStudentsCount * 34.5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
          <div>
            <div className="card-title">Historical Meal Logs</div>
            <div className="card-subtitle">Daily weight indices and student averages log</div>
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Present Students</th>
                <th style={{ textAlign: 'center' }}>Meals Ordered</th>
                <th style={{ textAlign: 'center' }}>Chapatis Prepared</th>
                <th style={{ textAlign: 'center' }}>Rice Prepared</th>
                <th style={{ textAlign: 'center' }}>Daal Prepared</th>
                <th style={{ textAlign: 'center' }}>Sabji Prepared</th>
                <th style={{ textAlign: 'center' }}>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.length > 0 ? (
                sortedHistory.map((log) => {
                  // Calculate present count for historical row
                  const activeStudentIds = new Set(
                    students.filter((s) => s.status !== 'dropout').map((s) => s.id)
                  );
                  const presentCount = records.filter(
                    (r) => r.date === log.date && r.status === 'present' && activeStudentIds.has(r.studentId)
                  ).length;

                  return (
                    <tr key={log.date}>
                      <td style={{ fontWeight: 600 }}>
                        {format(parseISO(log.date), 'dd MMM yyyy')}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--success)' }}>
                        {presentCount}
                      </td>
                      <td style={{ textAlign: 'center' }}>{log.mealsOrdered}</td>
                      <td style={{ textAlign: 'center' }}>
                        {log.chapatis} pcs <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--text-tertiary)' }}>({presentCount ? (log.chapatis / presentCount).toFixed(1) : 0} avg)</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.rice} kg <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--text-tertiary)' }}>({presentCount ? ((log.rice / presentCount) * 1000).toFixed(0) : 0}g avg)</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.daal} kg <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--text-tertiary)' }}>({presentCount ? ((log.daal / presentCount) * 1000).toFixed(0) : 0}g avg)</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.sabji} kg <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--text-tertiary)' }}>({presentCount ? ((log.sabji / presentCount) * 1000).toFixed(0) : 0}g avg)</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--accent-light)' }}>
                        ₹{(log.mealsOrdered * 34.5).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-xl)' }}>
                    No meal logs recorded yet. Use the form above to add your first record!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;
