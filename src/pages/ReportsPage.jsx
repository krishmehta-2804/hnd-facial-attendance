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
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = () => {
    setGenerating(true);
    setTimeout(() => {
      let data, columns, title;

      if (selectedClass === 'all') {
        title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Summary - ${demoSchool.name}`;
        data = stats.classStats.map((cls) => ({
          class: `Class ${cls.className}`,
          teacher: cls.teacherName,
          total: cls.total,
          present: cls.present,
          absent: cls.absent,
          late: cls.late,
          percentage: `${cls.percentage}%`,
        }));

        columns = [
          { header: 'Class', key: 'class' },
          { header: 'Teacher', key: 'teacher' },
          { header: 'Total', key: 'total' },
          { header: 'Present', key: 'present' },
          { header: 'Absent', key: 'absent' },
          { header: 'Late', key: 'late' },
          { header: 'Attendance %', key: 'percentage' },
        ];
      } else {
        const clsName = classes.find(c => c.id === selectedClass)?.name || '';
        const clsSec = classes.find(c => c.id === selectedClass)?.section || '';
        title = `Class ${clsName}-${clsSec} Attendance Detail - ${formatDate(new Date(reportDate))}`;
        
        const classStudents = students.filter(s => s.classId === selectedClass);
        data = classStudents.map(student => {
          const record = records.find(r => r.studentId === student.id && r.date === reportDate);
          return {
            rollNo: student.rollNo,
            name: student.name,
            status: (record?.status || 'absent').toUpperCase(),
            method: record ? (record.method === 'facial' ? 'Facial Recognition' : 'Manual Entry') : 'Manual Entry (Absent)',
            time: record ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            markedBy: record ? (record.markedBy === 'current-user' || record.markedBy === 'user-001' ? 'Teacher' : 'System') : '-'
          };
        });

        columns = [
          { header: 'Roll No', key: 'rollNo' },
          { header: 'Student Name', key: 'name' },
          { header: 'Status', key: 'status' },
          { header: 'Marking Method', key: 'method' },
          { header: 'Time', key: 'time' },
          { header: 'Marked By', key: 'markedBy' },
        ];
      }

      downloadPDF(
        title,
        data,
        columns,
        `attendance_report_${selectedClass}_${reportDate}.pdf`,
        {
          summary: selectedClass === 'all' ? [
            `Total Students: ${stats.totalEnrolled}`,
            `Present: ${stats.presentToday} | Absent: ${stats.absentToday} | Late: ${stats.lateToday}`,
            `Overall Attendance: ${stats.attendancePercentage}%`,
          ] : [
            `Class Size: ${data.length} Enrolled`,
            `Present: ${data.filter(d => d.status === 'PRESENT').length} | Absent: ${data.filter(d => d.status === 'ABSENT').length} | Late: ${data.filter(d => d.status === 'LATE').length}`,
          ]
        }
      );
      setGenerating(false);
    }, 500);
  };

  const handleDownloadCSV = () => {
    let data, columns;

    if (selectedClass === 'all') {
      data = stats.classStats.map((cls) => ({
        class: `Class ${cls.className}`,
        teacher: cls.teacherName,
        total: cls.total,
        present: cls.present,
        absent: cls.absent,
        late: cls.late,
        percentage: cls.percentage,
      }));

      columns = [
        { header: 'Class', key: 'class' },
        { header: 'Teacher', key: 'teacher' },
        { header: 'Total Students', key: 'total' },
        { header: 'Present', key: 'present' },
        { header: 'Absent', key: 'absent' },
        { header: 'Late', key: 'late' },
        { header: 'Attendance %', key: 'percentage' },
      ];
    } else {
      const classStudents = students.filter(s => s.classId === selectedClass);
      data = classStudents.map(student => {
        const record = records.find(r => r.studentId === student.id && r.date === reportDate);
        return {
          rollNo: student.rollNo,
          name: student.name,
          status: (record?.status || 'absent').toUpperCase(),
          method: record ? (record.method === 'facial' ? 'Facial Recognition' : 'Manual Entry') : 'Manual Entry (Absent)',
          time: record ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          markedBy: record ? (record.markedBy === 'current-user' || record.markedBy === 'user-001' ? 'Teacher' : 'System') : '-'
        };
      });

      columns = [
        { header: 'Roll No', key: 'rollNo' },
        { header: 'Student Name', key: 'name' },
        { header: 'Status', key: 'status' },
        { header: 'Marking Method', key: 'method' },
        { header: 'Time', key: 'time' },
        { header: 'Marked By', key: 'markedBy' },
      ];
    }

    downloadCSV(data, columns, `attendance_report_${selectedClass}_${reportDate}.csv`);
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
            <label>Date</label>
            <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
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
            <div className="card-subtitle">{demoSchool.name} · {formatDate(new Date(reportDate))}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            <Printer size={14} />
            Print
          </button>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          {selectedClass === 'all' ? (
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
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Marking Method</th>
                  <th>Time</th>
                  <th>Marked By</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const classStudents = students.filter(s => s.classId === selectedClass);
                  const studentRecords = classStudents.map(student => {
                    const record = records.find(r => r.studentId === student.id && r.date === reportDate);
                    return {
                      student,
                      status: record?.status || 'absent', // default to absent initially
                      method: record?.method || 'manual',
                      time: record ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                      markedBy: record ? (record.markedBy === 'current-user' || record.markedBy === 'user-001' ? 'Teacher' : (record.markedBy.startsWith('teacher-') ? record.markedBy.split('-')[1].replace(/^\w/, c => c.toUpperCase()) : 'System')) : '-'
                    };
                  });

                  if (studentRecords.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No students enrolled in this class.</td>
                      </tr>
                    );
                  }

                  return studentRecords.map(({ student, status, method, time, markedBy }) => (
                    <tr key={student.id}>
                      <td>{student.rollNo}</td>
                      <td style={{ fontWeight: 600 }}>{student.name}</td>
                      <td>
                        <span className={`badge badge-${status === 'present' ? 'success' : status === 'absent' ? 'danger' : 'warning'}`}>
                          {status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          background: method === 'facial' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                          color: method === 'facial' ? '#A78BFA' : '#94A3B8',
                          borderRadius: '4px',
                          fontWeight: '600',
                          border: method === 'facial' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(100, 116, 139, 0.3)',
                        }}>
                          {method === 'facial' ? '📷 Facial' : '✍️ Manual'}
                        </span>
                      </td>
                      <td>{time}</td>
                      <td>{markedBy}</td>
                    </tr>
                  ));
                })()}
              </tbody>
              <tfoot>
                {(() => {
                  const classStudents = students.filter(s => s.classId === selectedClass);
                  const classRecords = records.filter(r => r.classId === selectedClass && r.date === reportDate);
                  const classTotal = classStudents.length;
                  const classPresent = classRecords.filter(r => r.status === 'present').length;
                  const classAbsent = classRecords.filter(r => r.status === 'absent').length;
                  const classLate = classRecords.filter(r => r.status === 'late').length;
                  const classPct = classTotal > 0 ? Math.round(((classPresent + classLate) / classTotal) * 100 * 10) / 10 : 0;

                  return (
                    <tr style={{ background: 'var(--bg-glass-light)', fontWeight: 700 }}>
                      <td colSpan={2}>Class Total ({classTotal} Enrolled)</td>
                      <td>
                        <span className="badge badge-success" style={{ marginRight: '6px' }}>P: {classPresent}</span>
                        <span className="badge badge-danger" style={{ marginRight: '6px' }}>A: {classAbsent}</span>
                        <span className="badge badge-warning">L: {classLate}</span>
                      </td>
                      <td>Attendance %</td>
                      <td colSpan={2}>
                        <span className={`attendance-pct ${classPct >= 90 ? 'excellent' : classPct >= 75 ? 'good' : 'poor'}`}>
                          {classPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })()}
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
