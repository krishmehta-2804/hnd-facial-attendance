import { useState } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { demoMealData, demoSchool } from '../services/demoData';
import { format } from 'date-fns';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UtensilsCrossed, TrendingDown, Users, Package, AlertTriangle, AlertCircle, ShoppingCart } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MealPlanningPage = () => {
  const { stats, classes, getClassTodayStats, mealsOrdered, saveMealsOrdered } = useAttendance();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [orderQty, setOrderQty] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLabel = format(new Date(), 'dd MMM');

  const handleSaveOrder = (e) => {
    e.preventDefault();
    if (!selectedClass || !orderQty) return;
    saveMealsOrdered(todayStr, selectedClass, parseInt(orderQty, 10));
    setOrderQty('');
  };

  // Compute today's class-wise details
  const classWastageDetails = classes.map((cls) => {
    const classStats = getClassTodayStats(cls.id, todayStr);
    const present = classStats.present + classStats.late;
    const ordered = mealsOrdered[`${todayStr}_${cls.id}`] || 0;
    const wastage = Math.max(0, ordered - present);
    const wastagePct = ordered > 0 ? (wastage / ordered) * 100 : 0;
    return {
      ...cls,
      present,
      ordered,
      wastage,
      wastagePct,
    };
  });

  const todayOrderedTotal = classWastageDetails.reduce((sum, c) => sum + c.ordered, 0);
  const todayPresentTotal = classWastageDetails.reduce((sum, c) => sum + c.present, 0);
  const todayWastageTotal = Math.max(0, todayOrderedTotal - todayPresentTotal);
  const todayWastagePct = todayOrderedTotal > 0 ? (todayWastageTotal / todayOrderedTotal) * 100 : 0;
  const isExtremeWastage = todayWastagePct > 15;

  const meals = demoMealData;
  const todayMeal = meals[0];

  const totalMealsServed = meals.reduce((sum, m) => sum + m.mealsServed, 0);
  const totalWastage = meals.reduce((sum, m) => sum + m.wastageKg, 0);
  const avgWastage = (totalWastage / meals.length).toFixed(1);

  const chartData = {
    labels: meals.slice().reverse().map((m) => m.dateLabel),
    datasets: [
      {
        label: 'Meals Served',
        data: meals.slice().reverse().map((m) => m.mealsServed),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Present Students',
        data: meals.slice().reverse().map((m) => m.totalPresent),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
        ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
        ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94A3B8', padding: 16, font: { family: 'Inter', size: 12 }, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#E2E8F0',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(148,163,184,0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Mid-Day Meal Tracking</h1>
          <p>{demoSchool.name} · Meal planning and distribution</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card warning">
          <div className="stat-card-header">
            <div className="stat-card-icon warning"><UtensilsCrossed size={24} /></div>
          </div>
          <div className="stat-card-value">{todayOrderedTotal || '0'}</div>
          <div className="stat-card-label">Meals Ordered Today</div>
        </div>
        <div className="stat-card success">
          <div className="stat-card-header">
            <div className="stat-card-icon success"><Users size={24} /></div>
          </div>
          <div className="stat-card-value">{todayPresentTotal}</div>
          <div className="stat-card-label">Present Students Today</div>
        </div>
        <div className="stat-card danger" style={isExtremeWastage ? { border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.08)' } : {}}>
          <div className="stat-card-header">
            <div className="stat-card-icon danger"><TrendingDown size={24} /></div>
          </div>
          <div className="stat-card-value">{todayWastageTotal} <span style={{ fontSize: 'var(--font-size-sm)' }}>({todayWastagePct.toFixed(1)}%)</span></div>
          <div className="stat-card-label">Wasted Meals Today</div>
        </div>
        <div className="stat-card info">
          <div className="stat-card-header">
            <div className="stat-card-icon info"><ShoppingCart size={24} /></div>
          </div>
          <div className="stat-card-value">₹{(todayOrderedTotal * 34.5).toLocaleString('en-IN')}</div>
          <div className="stat-card-label">Today's Meal Budget</div>
        </div>
      </div>

      {/* Order Entry Form & Today's Summary */}
      <div className="two-col-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Left Column: Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Manual Meal Ordering</div>
              <div className="card-subtitle">Place or update meal orders for each class today</div>
            </div>
          </div>
          <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div>
              <label htmlFor="class-select">Select Class</label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name}-{cls.section} ({cls.teacherName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="order-qty">Meals Ordered</label>
              <input
                type="number"
                id="order-qty"
                placeholder="Enter quantity"
                value={orderQty}
                onChange={(e) => setOrderQty(e.target.value)}
                min="0"
                required
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Save Order
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)' }}>
            <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Today's Orders by Class</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classWastageDetails.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Class {c.name}-{c.section}</span>
                  <span style={{ fontWeight: 600 }}>
                    {c.ordered > 0 ? `${c.ordered} ordered` : 'No order yet'} (Pres: {c.present})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Wastage Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Wastage & Cost Summary</div>
              <div className="card-subtitle">Wastage tracking and cost metrics</div>
            </div>
          </div>
          
          {isExtremeWastage && (
            <div className="alert alert-danger" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-md)', 
              padding: 'var(--space-md)', 
              border: '1px solid var(--danger)', 
              background: 'rgba(239, 68, 68, 0.08)', 
              borderRadius: 'var(--radius)', 
              color: 'var(--danger-light)', 
              marginBottom: 'var(--space-md)' 
            }}>
              <AlertCircle size={24} />
              <div>
                <h4 style={{ color: 'var(--danger-light)', margin: 0, fontSize: 'var(--font-size-md)' }}>Extreme Food Wastage Alert ({todayWastagePct.toFixed(1)}%)</h4>
                <p style={{ color: 'rgba(248, 113, 113, 0.8)', fontSize: 'var(--font-size-sm)', margin: 0 }}>Today's food wastage exceeds the 15% threshold. Please align meal ordering with attendance data.</p>
              </div>
            </div>
          )}

          <div className="metrics-card" style={
            isExtremeWastage 
              ? { border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.08)', padding: 'var(--space-lg)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' } 
              : { border: '1px solid var(--border)', background: 'var(--bg-glass-light)', padding: 'var(--space-lg)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }
          }>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cost Per Student:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹34.50</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Meals Ordered:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{todayOrderedTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Cost of Order:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{(todayOrderedTotal * 34.5).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Present Students Count:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{todayPresentTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Effective Cost of Present Students:</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{(todayPresentTotal * 34.5).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-xs)' }}>
              <span style={{ color: isExtremeWastage ? 'var(--danger-light)' : 'var(--text-secondary)' }}>Wasted Meals / Wasted Cost:</span>
              <span style={{ fontWeight: 700, color: isExtremeWastage ? 'var(--danger-light)' : 'var(--warning)' }}>
                {todayWastageTotal} meals / ₹{(todayWastageTotal * 34.5).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Wastage Rate:</span>
              <span style={{ fontWeight: 700, color: isExtremeWastage ? 'var(--danger-light)' : 'var(--success)' }}>
                {todayWastagePct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Meals vs Attendance</div>
            <div className="chart-card-subtitle">Last 2 weeks comparison</div>
          </div>
        </div>
        <div className="chart-wrapper" style={{ height: '300px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Meal Records Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Meal Distribution Records</div>
            <div className="card-subtitle">Daily meal data for audit and compliance</div>
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Meals Served</th>
                <th>Actual Qty (kg)</th>
                <th>Est. Qty (kg)</th>
                <th>Wastage (kg)</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td style={{ fontWeight: 600 }}>{meal.dateLabel}</td>
                  <td>{meal.totalPresent}</td>
                  <td>{meal.mealsServed}</td>
                  <td>{meal.actualQuantityKg.toFixed(1)}</td>
                  <td>{meal.estimatedQuantityKg.toFixed(1)}</td>
                  <td>
                    <span style={{
                      color: meal.wastageKg > 2 ? 'var(--danger)' : 'var(--success)',
                      fontWeight: 600,
                    }}>
                      {meal.wastageKg.toFixed(1)}
                      {meal.wastageKg > 2 && <AlertTriangle size={12} style={{ marginLeft: '4px', display: 'inline' }} />}
                    </span>
                  </td>
                  <td>₹{(meal.mealsServed * meal.costPerMeal).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-glass-light)', fontWeight: 700 }}>
                <td>Total</td>
                <td>—</td>
                <td>{totalMealsServed}</td>
                <td>—</td>
                <td>—</td>
                <td style={{ color: 'var(--danger)' }}>{totalWastage.toFixed(1)}</td>
                <td>₹{(totalMealsServed * 34.5).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;
