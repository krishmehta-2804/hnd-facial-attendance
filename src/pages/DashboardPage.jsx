/**
 * Dashboard Page - Role-aware attendance dashboard
 */
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { demoAlerts, demoRecentActivity, demoSchool } from '../services/demoData';
import StatsCard from '../components/dashboard/StatsCard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import TrendChart from '../components/dashboard/TrendChart';
import ClassWiseTable from '../components/dashboard/ClassWiseTable';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import MealCounter from '../components/dashboard/MealCounter';
import { Users, UserCheck, UserX, Clock, BarChart3, Camera, FileText, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { calculateTrend, calculateStudentAttendanceStats, getAttendanceStatus } from '../utils/attendanceCalculations';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { stats, students, records, getStudentTodayStatus } = useAttendance();

  const trend = calculateTrend(stats.presentToday, stats.presentYesterday);

  // If the logged-in user is a Parent, render the Parent Portal Dashboard
  if (currentUser?.role === 'parent') {
    const parentChildren = students.filter(s => currentUser.childIds?.includes(s.id));
    
    return (
      <div className="dashboard-page">
        {/* Welcome Bar */}
        <div className="page-header">
          <div>
            <h1>Welcome back, {currentUser?.name?.split(' ')[0]} 👋</h1>
            <p>Parent Portal · {demoSchool.name}</p>
          </div>
        </div>

        {/* Children Overview */}
        <h3 style={{ marginBottom: 'var(--space-md)' }}>My Children</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          {parentChildren.map((child, index) => {
            const childStats = calculateStudentAttendanceStats(child.id, records);
            const childStatus = getAttendanceStatus(childStats.percentage);
            const todayStatus = getStudentTodayStatus(child.id);
            
            return (
              <div key={child.id} className={`card animate-fade-in-up stagger-${index + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                    {child.avatar}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{child.name}</h3>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Class {child.className} · Roll #{child.rollNo}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Today's Status</div>
                    <span className={`badge badge-${todayStatus === 'present' ? 'success' : todayStatus === 'absent' ? 'danger' : todayStatus === 'late' ? 'warning' : 'primary'}`}>
                      {todayStatus ? todayStatus.toUpperCase() : 'NOT MARKED YET'}
                    </span>
                  </div>
                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Attendance Rate</div>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: childStatus.color === 'success' ? 'var(--success)' : childStatus.color === 'warning' ? 'var(--warning)' : 'var(--danger)' }}>
                      {childStats.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${childStats.percentage}%`,
                      background: childStatus.color === 'success' ? 'var(--success)' : childStatus.color === 'warning' ? 'var(--warning)' : 'var(--danger)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </div>

                {/* Recent attendance logs for child */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: '4px' }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>Recent Attendance Log</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {records
                      .filter(r => r.studentId === child.id)
                      .slice(0, 5)
                      .map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{r.date}</span>
                          <span className={`text-${r.status === 'present' ? 'success' : r.status === 'absent' ? 'danger' : r.status === 'late' ? 'warning' : 'primary'}`} style={{ fontWeight: 600 }}>
                            {r.status.toUpperCase()} ({r.method})
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Teacher / Headmaster / Admin Dashboard view
  return (
    <div className="dashboard-page">
      {/* Welcome Bar */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p>{demoSchool.name} · {demoSchool.district}, Haryana</p>
        </div>
        <div className="page-actions">
          <a href="/attendance" className="btn btn-primary">
            <Camera size={16} />
            Mark Attendance
          </a>
          <a href="/reports" className="btn btn-ghost">
            <FileText size={16} />
            Generate Report
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="animate-fade-in-up stagger-1">
          <StatsCard
            title="Total Enrolled"
            value={stats.totalEnrolled}
            icon={Users}
            color="accent"
            trend="neutral"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatsCard
            title="Present Today"
            value={stats.presentToday}
            icon={UserCheck}
            color="success"
            trend={trend.direction}
            trendValue={trend.value}
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatsCard
            title="Absent Today"
            value={stats.absentToday}
            icon={UserX}
            color="danger"
            trend={trend.direction === 'up' ? 'down' : 'up'}
            trendValue={trend.value}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatsCard
            title="Late Arrivals"
            value={stats.lateToday}
            icon={Clock}
            color="warning"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="animate-fade-in-up stagger-3">
          <TrendChart
            dailyData={stats.trendData}
            weeklyData={stats.weeklyData}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <AttendanceChart
            present={stats.presentToday}
            absent={stats.absentToday}
            late={stats.lateToday}
          />
        </div>
      </div>

      {/* Meal Counter */}
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 'var(--space-xl)' }}>
        <div className="animate-fade-in-up stagger-5">
          <MealCounter
            presentCount={stats.presentToday + stats.lateToday}
            totalEnrolled={stats.totalEnrolled}
            yesterdayCount={stats.presentYesterday}
          />
        </div>
      </div>

      {/* Class-wise Table + Alerts */}
      <div className="two-col-grid">
        <div className="animate-fade-in-up stagger-5">
          <ClassWiseTable classData={stats.classStats} />
        </div>
        <div className="animate-fade-in-up stagger-6">
          <AlertsPanel alerts={demoAlerts} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card animate-fade-in-up" style={{ marginTop: 'var(--space-xl)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Recent Activity</div>
            <div className="card-subtitle">Latest actions and events</div>
          </div>
        </div>
        <div className="activity-list">
          {demoRecentActivity.map((item) => (
            <div key={item.id} className="activity-item">
              <div className={`activity-icon ${item.type}`}>
                {item.type === 'attendance' && <Camera size={16} />}
                {item.type === 'student' && <Users size={16} />}
                {item.type === 'report' && <FileText size={16} />}
                {item.type === 'alert' && <BarChart3 size={16} />}
                {item.type === 'meal' && <UtensilsCrossed size={16} />}
              </div>
              <div className="activity-info">
                <div className="activity-action">{item.action}</div>
                <div className="activity-detail">{item.detail} · {item.user}</div>
              </div>
              <div className="activity-time">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
