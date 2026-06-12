/**
 * Students Page - Student directory with search, filter, and cards
 */
import { useState, useMemo } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { calculateStudentAttendanceStats, getAttendanceStatus } from '../utils/attendanceCalculations';
import { Search, Grid3X3, List, UserPlus, Filter, ChevronRight } from 'lucide-react';
import '../styles/students.css';

const StudentsPage = () => {
  const { students, classes, records } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    let result = students;
    if (selectedClass !== 'all') {
      result = result.filter((s) => s.classId === selectedClass);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          String(s.rollNo).includes(q) ||
          s.className.toLowerCase().includes(q)
      );
    }
    return result;
  }, [students, selectedClass, searchQuery]);

  const getStudentStats = (studentId) => {
    return calculateStudentAttendanceStats(studentId, records);
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} students enrolled across {classes.length} classes</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <UserPlus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="students-toolbar">
        <div className="search-wrapper">
          <Search />
          <input
            type="text"
            placeholder="Search students by name, roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.name}-{cls.section}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Student Grid */}
      {viewMode === 'grid' ? (
        <div className="students-grid">
          {filteredStudents.slice(0, 24).map((student) => {
            const stats = getStudentStats(student.id);
            const status = getAttendanceStatus(stats.percentage);
            return (
              <div
                key={student.id}
                className="student-card animate-fade-in-up"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="student-card-header">
                  <div className="student-card-avatar">{student.avatar}</div>
                  <div className="student-card-info">
                    <h4>{student.name}</h4>
                    <p>Class {student.className} · Roll #{student.rollNo}</p>
                  </div>
                </div>

                <div className="student-card-stats">
                  <div className="student-card-stat">
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.present}</div>
                    <div className="stat-label">Present</div>
                  </div>
                  <div className="student-card-stat">
                    <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.absent}</div>
                    <div className="stat-label">Absent</div>
                  </div>
                  <div className="student-card-stat">
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.late}</div>
                    <div className="stat-label">Late</div>
                  </div>
                </div>

                <div className="student-card-footer">
                  <div className="student-card-attendance-bar">
                    <div
                      className={`fill ${status.color === 'success' ? 'excellent' : status.color === 'warning' ? 'good' : 'poor'}`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 700,
                    color: status.color === 'success' ? 'var(--success)' : status.color === 'warning' ? 'var(--warning)' : 'var(--danger)',
                  }}>
                    {stats.percentage}%
                  </span>
                </div>

                <div style={{ marginTop: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${status.color === 'success' ? 'success' : status.color === 'warning' ? 'warning' : 'danger'}`}>
                    {status.label}
                  </span>
                  {student.faceRegistered && (
                    <span className="badge badge-info">Face Registered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="card students-list-view">
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Roll No</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.slice(0, 50).map((student) => {
                  const stats = getStudentStats(student.id);
                  const status = getAttendanceStatus(stats.percentage);
                  const pctClass = stats.percentage >= 90 ? 'excellent' : stats.percentage >= 75 ? 'good' : 'poor';
                  return (
                    <tr key={student.id} onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '11px', fontWeight: 700,
                          }}>
                            {student.avatar}
                          </div>
                          <span style={{ fontWeight: 600 }}>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.className}</td>
                      <td>{student.rollNo}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{stats.present}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{stats.absent}</td>
                      <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{stats.late}</td>
                      <td><span className={`attendance-pct ${pctClass}`}>{stats.percentage}%</span></td>
                      <td><span className={`badge badge-${status.color === 'success' ? 'success' : status.color === 'warning' ? 'warning' : 'danger'}`}>{status.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredStudents.length > 24 && viewMode === 'grid' && (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
          Showing 24 of {filteredStudents.length} students. Use search or filters to narrow results.
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <>
          <div className="modal-backdrop" onClick={() => setSelectedStudent(null)} />
          <div className="modal glass" style={{ maxWidth: '600px' }}>
            <div style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 700,
                  boxShadow: '0 0 30px rgba(59,130,246,0.3)',
                }}>
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h3>{selectedStudent.name}</h3>
                  <p style={{ color: 'var(--text-tertiary)' }}>
                    Class {selectedStudent.className} · Roll #{selectedStudent.rollNo} · {selectedStudent.gender}
                  </p>
                </div>
              </div>

              {(() => {
                const stats = getStudentStats(selectedStudent.id);
                const status = getAttendanceStatus(stats.percentage);
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{stats.total}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total Days</div>
                      </div>
                      <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--success)' }}>{stats.present}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Present</div>
                      </div>
                      <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--danger)' }}>{stats.absent}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Absent</div>
                      </div>
                      <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--warning)' }}>{stats.late}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Late</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${stats.percentage}%`, borderRadius: 'var(--radius-full)',
                          background: status.color === 'success' ? 'linear-gradient(90deg, var(--success), var(--success-light))' : status.color === 'warning' ? 'linear-gradient(90deg, var(--warning), var(--warning-light))' : 'linear-gradient(90deg, var(--danger), var(--danger-light))',
                          transition: 'width 1s ease-out',
                        }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: status.color === 'success' ? 'var(--success)' : status.color === 'warning' ? 'var(--warning)' : 'var(--danger)' }}>
                        {stats.percentage}%
                      </span>
                    </div>
                  </>
                );
              })()}

              <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentsPage;
