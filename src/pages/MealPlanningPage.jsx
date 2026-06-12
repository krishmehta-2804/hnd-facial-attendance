/**
 * Mid-Day Meal Tracking Page
 */
import { useAttendance } from '../contexts/AttendanceContext';
import { demoMealData, demoSchool } from '../services/demoData';
import { calculateMealRequirement } from '../utils/attendanceCalculations';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UtensilsCrossed, TrendingDown, Users, Package, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MealPlanningPage = () => {
  const { stats } = useAttendance();
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
          <div className="stat-card-value">{todayMeal?.mealsServed || stats.presentToday}</div>
          <div className="stat-card-label">Meals Required Today</div>
        </div>
        <div className="stat-card success">
          <div className="stat-card-header">
            <div className="stat-card-icon success"><Users size={24} /></div>
          </div>
          <div className="stat-card-value">{stats.presentToday + stats.lateToday}</div>
          <div className="stat-card-label">Present Students</div>
        </div>
        <div className="stat-card info">
          <div className="stat-card-header">
            <div className="stat-card-icon info"><Package size={24} /></div>
          </div>
          <div className="stat-card-value">{todayMeal?.estimatedQuantityKg || '0'}</div>
          <div className="stat-card-label">Estimated Qty (kg)</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-card-header">
            <div className="stat-card-icon danger"><TrendingDown size={24} /></div>
          </div>
          <div className="stat-card-value">{avgWastage}</div>
          <div className="stat-card-label">Avg. Wastage (kg/day)</div>
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
                <th>Est. Qty (kg)</th>
                <th>Actual Qty (kg)</th>
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
                  <td>{meal.estimatedQuantityKg.toFixed(1)}</td>
                  <td>{meal.actualQuantityKg.toFixed(1)}</td>
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
                <td>₹{(totalMealsServed * 12.5).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;
