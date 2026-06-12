/**
 * Classes Page - Class-wise monitoring and teacher assignment
 */
import { useState, useMemo } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { School, User, Users, Plus, Edit2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAttendanceStatus } from '../utils/attendanceCalculations';

const ClassesPage = () => {
  const { classes, students, stats } = useAttendance();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [section, setSection] = useState('');

  // Calculate stats for each class dynamically
  const classListStats = useMemo(() => {
    return classes.map((cls) => {
      const classStudents = students.filter((s) => s.classId === cls.id);
      const stat = stats.classStats.find((cs) => cs.classId === cls.id) || {
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0,
      };

      return {
        ...cls,
        totalStudents: classStudents.length,
        ...stat,
      };
    });
  }, [classes, students, stats.classStats]);

  const handleEditClick = (cls) => {
    setSelectedClass(cls);
    setTeacherName(cls.teacherName);
    setSection(cls.section);
    setIsEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    // In a real app we'd save this to Firebase/Context
    selectedClass.teacherName = teacherName;
    selectedClass.section = section;

    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="classes-page">
      <div className="page-header">
        <div>
          <h1>Classes</h1>
          <p>Monitor class-wise attendance and manage teacher assignments</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => handleEditClick({ id: 'new', name: '', section: '', teacherName: '' })}>
            <Plus size={16} />
            Add New Class
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        {classListStats.map((cls) => {
          const attendanceStatus = getAttendanceStatus(cls.percentage);
          return (
            <div key={cls.id} className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {cls.name}
                  </div>
                  <div>
                    <h3 className="card-title">Class {cls.name}-{cls.section}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      <User size={12} />
                      <span>{cls.teacherName || 'No Teacher Assigned'}</span>
                    </div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(cls)} style={{ padding: '6px' }}>
                  <Edit2 size={14} />
                </button>
              </div>

              <div className="card-body" style={{ padding: 'var(--space-lg) 0', flexGrow: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                      <Users size={12} />
                      <span>Enrolled</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{cls.totalStudents} Students</span>
                  </div>

                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                      <CheckCircle2 size={12} />
                      <span>Today's Attendance</span>
                    </div>
                    <span style={{
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 700,
                      color: attendanceStatus.color === 'success' ? 'var(--success)' : attendanceStatus.color === 'warning' ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      {cls.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{cls.present + cls.late} / {cls.totalStudents} Present</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${cls.percentage}%`,
                      background: attendanceStatus.color === 'success' ? 'var(--success)' : attendanceStatus.color === 'warning' ? 'var(--warning)' : 'var(--danger)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </div>
              </div>

              <div className="card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${attendanceStatus.color === 'success' ? 'success' : attendanceStatus.color === 'warning' ? 'warning' : 'danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {attendanceStatus.color === 'danger' && <AlertTriangle size={10} />}
                  {attendanceStatus.label}
                </span>

                <a href={`/students?class=${cls.id}`} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)' }}>
                  <span>View Students</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Class Modal */}
      {isEditModalOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)} />
          <div className="modal glass" style={{ maxWidth: '450px' }}>
            <div style={{ padding: 'var(--space-xl)' }}>
              <h2>{selectedClass?.id === 'new' ? 'Add New Class' : `Edit Class ${selectedClass?.name}`}</h2>
              <form onSubmit={handleSave} style={{ marginTop: 'var(--space-lg)' }}>
                {selectedClass?.id === 'new' && (
                  <div className="form-group" style={{ marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Class Number (e.g. 1, 2, 3)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 5"
                      required
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Section</label>
                  <input
                    type="text"
                    className="input"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. A"
                    required
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Class Teacher</label>
                  <input
                    type="text"
                    className="input"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassesPage;
