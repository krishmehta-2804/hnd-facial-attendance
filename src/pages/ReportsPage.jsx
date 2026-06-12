/**
 * Reports Page - Generate and download attendance reports
 */
import { useState } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { demoSchool } from '../services/demoData';
import { downloadPDF, downloadCSV } from '../utils/exportUtils';
import { formatDate } from '../utils/dateUtils';
import {
  FileText, Download, Calendar, Filter, FileSpreadsheet,
  BarChart3, Printer,
} from 'lucide-react';

const ReportsPage = () => {
  const { stats, students, classes, records } = useAttendance();
  const [reportType, setReportType] = useState('daily');
  const [selectedClass, setSelectedClass] = useState('all');
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = () => {
    setGenerating(true);
    setTimeout(() => {
      const data = stats.classStats.map((cls) => ({
        class: `Class ${cls.className}`,
        teacher: cls.teacherName,
        total: cls.total,
        present: cls.present,
        absent: cls.absent,
        late: cls.late,
        percentage: `${cls.percentage}%`,
      }));

      const columns = [
        { header: 'Class', key: 'class' },
        { header: 'Teacher', key: 'teacher' },
        { header: 'Total', key: 'total' },
        { header: 'Present', key: 'present' },
        { header: 'Absent', key: 'absent' },
        { header: 'Late', key: 'late' },
        { header: 'Attendance %', key: 'percentage' },
      ];

      downloadPDF(
        `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report - ${demoSchool.name}`,
        data,
        columns,
        `attendance_report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`,
        {
          summary: [
            `Total Students: ${stats.totalEnrolled}`,
            `Present: ${stats.presentToday} | Absent: ${stats.absentToday} | Late: ${stats.lateToday}`,
            `Overall Attendance: ${stats.attendancePercentage}%`,
          ],
        }
      );
      setGenerating(false);
    }, 500);
  };

  const handleDownloadCSV = () => {
    const data = stats.classStats.map((cls) => ({
      class: `Class ${cls.className}`,
      teacher: cls.teacherName,
      total: cls.total,
      present: cls.present,
      absent: cls.absent,
      late: cls.late,
      percentage: cls.percentage,
    }));

    const columns = [
      { header: 'Class', key: 'class' },
      { header: 'Teacher', key: 'teacher' },
      { header: 'Total Students', key: 'total' },
      { header: 'Present', key: 'present' },
      { header: 'Absent', key: 'absent' },
      { header: 'Late', key: 'late' },
      { header: 'Attendance %', key: 'percentage' },
    ];

    downloadCSV(data, columns, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const reportTypes = [
    { id: 'daily', label: 'Daily Report', desc: 'Today\'s attendance summary' },
    { id: 'weekly', label: 'Weekly Report', desc: 'This week\'s attendance trends' },
    { id: 'monthly', label: 'Monthly Report', desc: 'Monthly attendance analytics' },
    { id: 'student', label: 'Student Report', desc: 'Individual student attendance' },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Generate, view, and download attendance reports</p>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {reportTypes.map((type) => (
          <div
            key={type.id}
            className={`card ${reportType === type.id ? '' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: reportType === type.id ? 'var(--accent)' : undefined,
              background: reportType === type.id ? 'rgba(59,130,246,0.05)' : undefined,
            }}
            onClick={() => setReportType(type.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius)',
                background: reportType === type.id ? 'rgba(59,130,246,0.1)' : 'var(--bg-glass-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: reportType === type.id ? 'var(--accent)' : 'var(--text-tertiary)',
              }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{type.label}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{type.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} />
            Report Filters
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label>Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>Class {cls.name}-{cls.section}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label>Date Range</label>
            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={generating}>
              <Download size={16} />
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
            <button className="btn btn-ghost" onClick={handleDownloadCSV}>
              <FileSpreadsheet size={16} />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Report Preview</div>
            <div className="card-subtitle">{demoSchool.name} · {formatDate(new Date())}</div>
          </div>
          <button className="btn btn-ghost btn-sm">
            <Printer size={14} />
            Print
          </button>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Teacher</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {stats.classStats.map((cls) => {
                const pctClass = cls.percentage >= 90 ? 'excellent' : cls.percentage >= 75 ? 'good' : 'poor';
                return (
                  <tr key={cls.classId}>
                    <td style={{ fontWeight: 600 }}>Class {cls.className}</td>
                    <td>{cls.teacherName}</td>
                    <td>{cls.total}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{cls.present}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{cls.absent}</td>
                    <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{cls.late}</td>
                    <td><span className={`attendance-pct ${pctClass}`}>{cls.percentage}%</span></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-glass-light)', fontWeight: 700 }}>
                <td colSpan={2}>School Total</td>
                <td>{stats.totalEnrolled}</td>
                <td style={{ color: 'var(--success)' }}>{stats.presentToday}</td>
                <td style={{ color: 'var(--danger)' }}>{stats.absentToday}</td>
                <td style={{ color: 'var(--warning)' }}>{stats.lateToday}</td>
                <td>
                  <span className={`attendance-pct ${stats.attendancePercentage >= 90 ? 'excellent' : stats.attendancePercentage >= 75 ? 'good' : 'poor'}`}>
                    {stats.attendancePercentage}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
