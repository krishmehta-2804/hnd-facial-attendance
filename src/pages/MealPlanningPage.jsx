import { useMemo } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { demoSchool } from '../services/demoData';
import { format } from 'date-fns';
import { UtensilsCrossed, Users, Info, Calendar } from 'lucide-react';

const MealPlanningPage = () => {
  const { stats, classes, getClassTodayStats } = useAttendance();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLabel = format(new Date(), 'dd MMMM yyyy');

  // Define scaling factors per present student
  const getMealScales = (grade) => {
    // Primary (UKG to Class 2)
    if (grade <= 2) {
      return {
        chapatis: 1.5,
        daalKg: 0.10,
        riceKg: 0.12,
        sabjiKg: 0.08
      };
    }
    // Upper Primary (Class 3 to 5)
    return {
      chapatis: 2.0,
      daalKg: 0.12,
      riceKg: 0.15,
      sabjiKg: 0.10
    };
  };

  // Compile today's class-wise details
  const classMealDetails = useMemo(() => {
    return classes.map((cls) => {
      const classStats = getClassTodayStats(cls.id, todayStr);
      const present = classStats.present;
      const scales = getMealScales(cls.grade);

      return {
        id: cls.id,
        className: `${cls.name}-${cls.section}`,
        teacherName: cls.teacherName,
        total: classStats.total,
        present,
        chapatis: Math.round(present * scales.chapatis),
        daal: parseFloat((present * scales.daalKg).toFixed(2)),
        rice: parseFloat((present * scales.riceKg).toFixed(2)),
        sabji: parseFloat((present * scales.sabjiKg).toFixed(2))
      };
    });
  }, [classes, getClassTodayStats, todayStr]);

  // Totals calculations
  const totals = useMemo(() => {
    return classMealDetails.reduce(
      (sum, c) => ({
        total: sum.total + c.total,
        present: sum.present + c.present,
        chapatis: sum.chapatis + c.chapatis,
        daal: parseFloat((sum.daal + c.daal).toFixed(2)),
        rice: parseFloat((sum.rice + c.rice).toFixed(2)),
        sabji: parseFloat((sum.sabji + c.sabji).toFixed(2))
      }),
      { total: 0, present: 0, chapatis: 0, daal: 0, rice: 0, sabji: 0 }
    );
  }, [classMealDetails]);

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1>Mid-Day Meal Planner</h1>
          <p>{demoSchool.name} · Real-time attendance meal coordinator</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 'var(--font-size-sm)', color: 'var(--text)' }}>
          <Calendar size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: 600 }}>{todayLabel}</span>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card info">
          <div className="stat-card-header">
            <div className="stat-card-icon info"><Users size={20} /></div>
          </div>
          <div className="stat-card-value">{totals.present}</div>
          <div className="stat-card-label">Students Present Today</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-card-header">
            <div className="stat-card-icon success"><UtensilsCrossed size={20} /></div>
          </div>
          <div className="stat-card-value">{totals.chapatis}</div>
          <div className="stat-card-label">Total Chapatis Required</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-card-header">
            <div className="stat-card-icon warning"><UtensilsCrossed size={20} /></div>
          </div>
          <div className="stat-card-value">{totals.daal} <span style={{ fontSize: 'var(--font-size-xs)' }}>kg</span></div>
          <div className="stat-card-label">Total Daal Required</div>
        </div>

        <div className="stat-card primary">
          <div className="stat-card-header">
            <div className="stat-card-icon primary"><UtensilsCrossed size={20} /></div>
          </div>
          <div className="stat-card-value">{totals.rice} <span style={{ fontSize: 'var(--font-size-xs)' }}>kg</span></div>
          <div className="stat-card-label">Total Rice Required</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-card-header">
            <div className="stat-card-icon danger"><UtensilsCrossed size={20} /></div>
          </div>
          <div className="stat-card-value">{totals.sabji} <span style={{ fontSize: 'var(--font-size-xs)' }}>kg</span></div>
          <div className="stat-card-label">Total Sabji Required</div>
        </div>
      </div>

      {/* Main Class-Wise Tracker Table */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
          <div>
            <div className="card-title">Class-Wise Food Tracker Guide</div>
            <div className="card-subtitle">Detailed recipe weights and quantity guide based on morning attendance registers</div>
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Class Teacher</th>
                <th style={{ textAlign: 'center' }}>Enrolled</th>
                <th style={{ textAlign: 'center' }}>Present Today</th>
                <th style={{ textAlign: 'center' }}>Chapatis Required</th>
                <th style={{ textAlign: 'center' }}>Daal (kg)</th>
                <th style={{ textAlign: 'center' }}>Rice (kg)</th>
                <th style={{ textAlign: 'center' }}>Sabji (kg)</th>
              </tr>
            </thead>
            <tbody>
              {classMealDetails.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>Class {c.className}</td>
                  <td>{c.teacherName}</td>
                  <td style={{ textAlign: 'center' }}>{c.total}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--success)' }}>{c.present}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{c.chapatis} pcs</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{c.daal.toFixed(2)} kg</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{c.rice.toFixed(2)} kg</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{c.sabji.toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-glass-light)', fontWeight: 700, fontSize: 'var(--font-size-md)' }}>
                <td colSpan={2}>Grand Total Guide</td>
                <td style={{ textAlign: 'center' }}>{totals.total}</td>
                <td style={{ textAlign: 'center', color: 'var(--success)' }}>{totals.present}</td>
                <td style={{ textAlign: 'center', color: 'var(--success)' }}>{totals.chapatis} pcs</td>
                <td style={{ textAlign: 'center', color: 'var(--warning)' }}>{totals.daal.toFixed(2)} kg</td>
                <td style={{ textAlign: 'center', color: 'var(--accent-light)' }}>{totals.rice.toFixed(2)} kg</td>
                <td style={{ textAlign: 'center', color: 'var(--danger-light)' }}>{totals.sabji.toFixed(2)} kg</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Information Banner */}
      <div className="card" style={{ padding: 'var(--space-md)', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius)', color: 'var(--text)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
          <Info size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: 'var(--font-size-md)', color: 'var(--accent-light)' }}>Automatic Ingredient Calculation Guidelines</h4>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              To ensure zero wastage and healthy portions, ingredient requirements are dynamically scaled based on the class level:
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              <li><strong>Primary Classes (UKG, Class 1, Class 2)</strong>: 1.5 Chapatis, 100g Daal, 120g Rice, and 80g Sabji per student.</li>
              <li><strong>Upper Primary Classes (Class 3, Class 4, Class 5)</strong>: 2.0 Chapatis, 120g Daal, 150g Rice, and 100g Sabji per student.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;
