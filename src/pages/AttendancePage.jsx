/**
 * Attendance Page - Mark attendance via facial recognition or manual mode
 */
import { useState, useCallback } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { ATTENDANCE_STATUS } from '../utils/constants';
import { formatTime } from '../utils/dateUtils';
import {
  Camera, UserCheck, List, Search, CheckCircle2, XCircle, Clock,
  AlertCircle, ChevronDown,
} from 'lucide-react';
import '../styles/attendance.css';

const AttendancePage = () => {
  const { students, classes, todayRecords, markAttendance, getClassStudents, getClassTodayStats } = useAttendance();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [mode, setMode] = useState('manual'); // 'facial' or 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [recentMarked, setRecentMarked] = useState([]);

  const classStudents = getClassStudents(selectedClass);
  const classStats = getClassTodayStats(selectedClass);

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.rollNo).includes(searchQuery)
  );

  const getStudentStatus = (studentId) => {
    const record = todayRecords.find((r) => r.studentId === studentId);
    return record?.status || null;
  };

  const handleMark = useCallback((studentId, status) => {
    const record = markAttendance(studentId, status, 'manual');
    if (record) {
      setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
    }
  }, [markAttendance]);

  const handleMarkAll = (status) => {
    classStudents.forEach((student) => {
      if (!getStudentStatus(student.id)) {
        markAttendance(student.id, status, 'manual');
      }
    });
  };

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <p>Select a class and mark attendance for today</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-success btn-sm" onClick={() => handleMarkAll(ATTENDANCE_STATUS.PRESENT)}>
            <CheckCircle2 size={14} />
            Mark All Present
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="attendance-mode-tabs">
        <button
          className={`attendance-mode-tab ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <List size={16} />
          Manual
        </button>
        <button
          className={`attendance-mode-tab ${mode === 'facial' ? 'active' : ''}`}
          onClick={() => setMode('facial')}
        >
          <Camera size={16} />
          Facial Recognition
        </button>
      </div>

      {/* Class Selector */}
      <div className="class-selector">
        {classes.map((cls) => (
          <button
            key={cls.id}
            className={`class-chip ${selectedClass === cls.id ? 'active' : ''}`}
            onClick={() => setSelectedClass(cls.id)}
          >
            Class {cls.name}-{cls.section}
          </button>
        ))}
      </div>

      {/* Class Stats Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-lg)' }}>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text)' }}>{classStats.total}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--success)' }}>{classStats.present}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Present</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--danger)' }}>{classStats.absent}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Absent</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--warning)' }}>{classStats.late}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Late</div>
        </div>
      </div>

      {mode === 'facial' ? (
        /* Facial Recognition Mode */
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>
            <Camera size={36} style={{ color: 'var(--accent)' }} />
          </div>
          <h3>Facial Recognition Mode</h3>
          <p style={{ maxWidth: '400px', margin: '8px auto 24px' }}>
            Position the tablet camera facing students. The system will automatically detect and recognize enrolled faces.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
            <button className="btn btn-primary btn-lg">
              <Camera size={18} />
              Start Camera
            </button>
          </div>
          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--warning-bg)', borderRadius: 'var(--radius)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--warning-light)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <AlertCircle size={16} />
              Face recognition requires face-api.js models to be loaded. Using manual mode for demo.
            </p>
          </div>
        </div>
      ) : (
        /* Manual Mode */
        <>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 'var(--space-lg)', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '42px', height: '44px' }}
            />
          </div>

          {/* Student List */}
          <div className="manual-attendance-grid">
            {filteredStudents.map((student) => {
              const status = getStudentStatus(student.id);
              return (
                <div
                  key={student.id}
                  className={`student-attendance-card ${status || ''}`}
                >
                  <div className="student-avatar" style={{
                    width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #8B5CF6 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: 'var(--font-size-sm)', flexShrink: 0,
                  }}>
                    {student.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--text)' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      Roll #{student.rollNo}
                    </div>
                  </div>
                  <div className="attendance-toggle">
                    <button
                      className={status === ATTENDANCE_STATUS.PRESENT ? 'active-present' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.PRESENT)}
                      title="Present"
                    >
                      <CheckCircle2 size={12} /> P
                    </button>
                    <button
                      className={status === ATTENDANCE_STATUS.ABSENT ? 'active-absent' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.ABSENT)}
                      title="Absent"
                    >
                      <XCircle size={12} /> A
                    </button>
                    <button
                      className={status === ATTENDANCE_STATUS.LATE ? 'active-late' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.LATE)}
                      title="Late"
                    >
                      <Clock size={12} /> L
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent Marked Feed */}
      {recentMarked.length > 0 && (
        <div className="attendance-feed">
          <div className="attendance-feed-header">
            <h4>Recently Marked</h4>
            <span className="badge badge-primary">{recentMarked.length}</span>
          </div>
          <div className="attendance-feed-list">
            {recentMarked.slice(0, 5).map((record) => (
              <div key={record.id} className="attendance-feed-item">
                <div className="student-avatar">
                  {record.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="feed-info">
                  <div className="feed-name">{record.studentName}</div>
                  <div className="feed-meta">{record.className} · {formatTime(record.timestamp)}</div>
                </div>
                <div className="feed-status">
                  <span className={`badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
