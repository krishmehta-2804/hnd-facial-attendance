/**
 * AdminPortalPage - Dedicated backend portal for customers to manage students, teachers, and credentials
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import db from '../services/offlineDB';
import { format } from 'date-fns';
import { 
  Database, Plus, Edit2, Trash2, Key, X, Search, LogOut, ArrowLeft, Check, AlertTriangle
} from 'lucide-react';

const AdminPortalPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updatePassword } = useAuth();
  const { 
    students, classes, teachers,
    addStudent, updateStudent, deleteStudent,
    addTeacher, updateTeacher, deleteTeacher,
    updateClassTeacher
  } = useAttendance();

  // Redirect if not administrator
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const [dataSubTab, setDataSubTab] = useState('students'); // 'students', 'teachers', 'passwords'
  const [dbUsers, setDbUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('student'); // 'student', 'teacher', 'password'
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Student Form States
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentAdm, setStudentAdm] = useState('');
  const [studentClassId, setStudentClassId] = useState('');
  const [studentGender, setStudentGender] = useState('male');
  const [studentParentPhone, setStudentParentPhone] = useState('');
  const [studentFather, setStudentFather] = useState('');
  const [studentMother, setStudentMother] = useState('');
  const [studentDueOption, setStudentDueOption] = useState('0'); // '0', '200', '400', '600'

  // Teacher Form States
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('teacher123');
  const [teacherClassId, setTeacherClassId] = useState('none');

  // Password Form States
  const [newPasswordValue, setNewPasswordValue] = useState('');

  const getCurrentTargetDue = () => {
    const currentMonth = new Date().getMonth();
    let monthsElapsed = currentMonth - 3;
    if (monthsElapsed < 0) monthsElapsed += 12;
    monthsElapsed += 1;
    return monthsElapsed * 200;
  };

  const loadDbUsers = async () => {
    try {
      const users = await db.users.toArray();
      setDbUsers(users);
    } catch (e) {
      console.error('Failed to load credentials list:', e);
    }
  };

  useEffect(() => {
    loadDbUsers();
  }, [dataSubTab]);

  // ─── Search & Filters ─────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClassFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  const filteredUsers = useMemo(() => {
    return dbUsers.filter(u => 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dbUsers, searchQuery]);

  // ─── Modal Opening Actions ───────────────────────────────────
  const openAddStudent = () => {
    setStudentName('');
    setStudentRoll(students.length + 1);
    setStudentAdm('');
    setStudentClassId(classes[0]?.id || '');
    setStudentGender('male');
    setStudentParentPhone('');
    setStudentFather('');
    setStudentMother('');
    setStudentDueOption('0');
    
    setModalType('student');
    setModalMode('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditStudent = (student) => {
    setStudentName(student.name);
    setStudentRoll(student.rollNo);
    setStudentAdm(student.admissionNo);
    setStudentClassId(student.classId);
    setStudentGender(student.gender);
    setStudentParentPhone(student.parentPhone);
    setStudentFather(student.fatherName);
    setStudentMother(student.motherName);
    
    const targetDue = getCurrentTargetDue();
    const dueAmount = targetDue - (student.feesPaid || 0);
    if (dueAmount === 200) setStudentDueOption('200');
    else if (dueAmount === 400) setStudentDueOption('400');
    else if (dueAmount === 600) setStudentDueOption('600');
    else setStudentDueOption('0');
    
    setModalType('student');
    setModalMode('edit');
    setSelectedItem(student);
    setShowModal(true);
  };

  const openAddTeacher = () => {
    setTeacherName('');
    setTeacherEmail('');
    setTeacherPhone('');
    setTeacherPassword('teacher123');
    setTeacherClassId('none');
    
    setModalType('teacher');
    setModalMode('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditTeacher = (teacher) => {
    setTeacherName(teacher.name);
    setTeacherEmail(teacher.email);
    setTeacherPhone(teacher.phone || '');
    setTeacherPassword('');
    setTeacherClassId(teacher.assignedClasses?.[0] || 'none');
    
    setModalType('teacher');
    setModalMode('edit');
    setSelectedItem(teacher);
    setShowModal(true);
  };

  const openChangePassword = (user) => {
    setNewPasswordValue('');
    setModalType('password');
    setSelectedItem(user);
    setShowModal(true);
  };

  // ─── Form Submission Handles ─────────────────────────────────
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === studentClassId);
    const studentData = {
      id: modalMode === 'add' ? `student-${studentAdm.toLowerCase().trim()}` : selectedItem.id,
      admissionNo: studentAdm.trim().toUpperCase(),
      name: studentName.trim(),
      rollNo: parseInt(studentRoll) || students.length + 1,
      classId: studentClassId,
      className: targetClass ? (targetClass.name === 'UKG' ? 'UKG-A' : `Class ${targetClass.name}-A`) : '',
      grade: targetClass ? targetClass.grade : 1,
      section: 'A',
      gender: studentGender,
      schoolId: 'school-001',
      parentPhone: studentParentPhone.trim(),
      enrollmentDate: modalMode === 'add' ? format(new Date(), 'dd-MM-yyyy') : selectedItem.enrollmentDate,
      faceRegistered: modalMode === 'add' ? false : selectedItem.faceRegistered,
      avatar: studentName.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0,2).toUpperCase(),
      feesPaid: (() => {
        const targetDue = getCurrentTargetDue();
        if (studentDueOption === '200') return Math.max(0, targetDue - 200);
        if (studentDueOption === '400') return Math.max(0, targetDue - 400);
        if (studentDueOption === '600') return Math.max(0, targetDue - 600);
        return targetDue;
      })(),
      fatherName: studentFather.trim() || 'Not Provided',
      motherName: studentMother.trim() || 'Not Provided'
    };

    try {
      if (modalMode === 'add') {
        await addStudent(studentData);
        setSuccessMsg(`Student "${studentName}" added successfully.`);
      } else {
        await updateStudent(selectedItem.id, studentData);
        setSuccessMsg(`Student "${studentName}" details updated.`);
      }
      setShowModal(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Database Error: ${err.message || err.toString()}`);
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const avatarInitials = teacherName.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0,2).toUpperCase();
    const assignedClasses = teacherClassId === 'none' ? [] : [teacherClassId];
    
    const teacherData = {
      id: modalMode === 'add' ? `teacher-${teacherName.toLowerCase().replace(/\s+/g, '-')}` : selectedItem.id,
      name: teacherName.trim(),
      email: teacherEmail.trim().toLowerCase(),
      role: 'teacher',
      schoolId: 'school-001',
      assignedClasses,
      phone: teacherPhone.trim(),
      avatar: avatarInitials
    };

    try {
      if (modalMode === 'add') {
        await addTeacher(teacherData, teacherPassword);
        if (teacherClassId !== 'none') {
          await updateClassTeacher(teacherClassId, teacherData.id, `${teacherName} (Assigned)`);
        }
        setSuccessMsg(`Teacher "${teacherName}" registered successfully.`);
      } else {
        await updateTeacher(selectedItem.id, teacherData);
        if (teacherClassId !== 'none') {
          await updateClassTeacher(teacherClassId, selectedItem.id, `${teacherName} (Assigned)`);
        }
        setSuccessMsg(`Teacher "${teacherName}" updated.`);
      }
      setShowModal(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Database Error: ${err.message || err.toString()}`);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordValue.trim() || newPasswordValue.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }

    try {
      await updatePassword(selectedItem.id, newPasswordValue.trim());
      await loadDbUsers();
      setSuccessMsg(`Password for ${selectedItem.email} successfully updated.`);
      setShowModal(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Database Error: ${err.message || err.toString()}`);
    }
  };

  const handleDeleteStudent = async (studentId, name) => {
    if (confirm(`Are you sure you want to delete student "${name}"? This wipes their biometric details.`)) {
      try {
        await deleteStudent(studentId);
        setSuccessMsg(`Student "${name}" deleted.`);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        alert(err.toString());
      }
    }
  };

  const handleDeleteTeacher = async (teacherId, name) => {
    if (confirm(`Are you sure you want to delete teacher "${name}"?`)) {
      try {
        await deleteTeacher(teacherId);
        setSuccessMsg(`Teacher "${name}" deleted.`);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        alert(err.toString());
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Standalone Admin Portal Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', padding: '8px', borderRadius: 'var(--radius)', color: 'white', display: 'flex' }}>
            <Database size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-md)', margin: 0, fontWeight: 700 }}>HND Roster Backend</h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Central School Administration Portal</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} />
            <span>Go to Web App</span>
          </button>
          <button className="btn btn-ghost" onClick={() => { logout(); navigate('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Database Content */}
      <main style={{ flex: 1, padding: 'var(--space-xl)', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          
          {/* Header Action Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                className={`btn ${dataSubTab === 'students' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setDataSubTab('students'); setSearchQuery(''); }}
              >
                Students Directory ({students.length})
              </button>
              <button 
                className={`btn ${dataSubTab === 'teachers' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setDataSubTab('teachers'); setSearchQuery(''); }}
              >
                Teachers ({teachers.length})
              </button>
              <button 
                className={`btn ${dataSubTab === 'passwords' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setDataSubTab('passwords'); setSearchQuery(''); }}
              >
                Passwords & Logins
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              {savedSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  <Check size={16} />
                  <span>{successMsg}</span>
                </div>
              )}
              {dataSubTab === 'students' && (
                <button className="btn btn-primary" onClick={openAddStudent}>
                  <Plus size={16} />
                  Add Student
                </button>
              )}
              {dataSubTab === 'teachers' && (
                <button className="btn btn-primary" onClick={openAddTeacher}>
                  <Plus size={16} />
                  Add Teacher
                </button>
              )}
            </div>
          </div>

          {/* Search bar and Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder={`Search ${dataSubTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
              />
            </div>
            {dataSubTab === 'students' && (
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
              >
                <option value="all">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Class {c.name}-{c.section}</option>
                ))}
              </select>
            )}
          </div>

          {/* Data Tables */}
          <div className="table-container" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            {dataSubTab === 'students' && (
              <table>
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Admission No</th>
                    <th>Parent Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? filteredStudents.map(s => (
                    <tr key={s.id}>
                      <td>{s.rollNo}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.className}</td>
                      <td><code>{s.admissionNo}</code></td>
                      <td>{s.parentPhone}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => openEditStudent(s)} title="Edit Student">
                            <Edit2 size={14} style={{ color: 'var(--accent)' }} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => handleDeleteStudent(s.id, s.name)} title="Delete Student">
                            <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-lg)' }}>No students found matching filters.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {dataSubTab === 'teachers' && (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Assigned Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length > 0 ? filteredTeachers.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>{t.email}</td>
                      <td>{t.phone || 'N/A'}</td>
                      <td>{t.assignedClasses?.[0] ? classes.find(c => c.id === t.assignedClasses[0])?.name || 'Class Assigned' : 'None'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => openEditTeacher(t)} title="Edit Teacher">
                            <Edit2 size={14} style={{ color: 'var(--accent)' }} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => handleDeleteTeacher(t.id, t.name)} title="Delete Teacher">
                            <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-lg)' }}>No teachers found.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {dataSubTab === 'passwords' && (
              <table>
                <thead>
                  <tr>
                    <th>Name / Role</th>
                    <th>Login Email / ID</th>
                    <th>Role</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td><code>{u.email}</code></td>
                      <td><span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'headmaster' ? 'success' : 'info'}`}>{u.role.toUpperCase()}</span></td>
                      <td><code>••••••••</code> ({u.password})</td>
                      <td>
                        <button className="btn btn-ghost" style={{ padding: '6px', display: 'flex', gap: '4px', alignItems: 'center' }} onClick={() => openChangePassword(u)}>
                          <Key size={14} style={{ color: 'var(--warning)' }} />
                          <span style={{ fontSize: 'var(--font-size-xs)' }}>Change</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-lg)' }}>No accounts found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Database Modals */}
      {showModal && (
        <div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
          <div className="modal glass" style={{ maxWidth: '600px', display: 'block', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
              <h3 style={{ margin: 0 }}>
                {modalType === 'student' && `${modalMode === 'add' ? 'Add' : 'Edit'} Student`}
                {modalType === 'teacher' && `${modalMode === 'add' ? 'Add' : 'Edit'} Teacher`}
                {modalType === 'password' && `Change Password`}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Student Form */}
            {modalType === 'student' && (
              <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Full Name</label>
                    <input type="text" className="input" required value={studentName} onChange={(e) => setStudentName(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Admission Number</label>
                    <input type="text" className="input" required placeholder="CSCBV-HR4237-..." disabled={modalMode === 'edit'} value={studentAdm} onChange={(e) => setStudentAdm(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: modalMode === 'edit' ? 'var(--text-tertiary)' : 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Class</label>
                    <select value={studentClassId} onChange={(e) => setStudentClassId(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>Class {c.name}-{c.section}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Roll No</label>
                    <input type="number" className="input" required value={studentRoll} onChange={(e) => setStudentRoll(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Gender</label>
                    <select value={studentGender} onChange={(e) => setStudentGender(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Parent Mobile Number</label>
                    <input type="text" className="input" required pattern="\d{10}" placeholder="10-digit number" value={studentParentPhone} onChange={(e) => setStudentParentPhone(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Father's Name</label>
                    <input type="text" className="input" value={studentFather} onChange={(e) => setStudentFather(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Mother's Name</label>
                    <input type="text" className="input" value={studentMother} onChange={(e) => setStudentMother(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Starting Due Balance</label>
                    <select value={studentDueOption} onChange={(e) => setStudentDueOption(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                      <option value="0">₹0 Due (Paid Up)</option>
                      <option value="200">₹200 Due</option>
                      <option value="400">₹400 Due</option>
                      <option value="600">₹600 Due</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Student</button>
                </div>
              </form>
            )}

            {/* Teacher Form */}
            {modalType === 'teacher' && (
              <form onSubmit={handleTeacherSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Full Name</label>
                    <input type="text" className="input" required value={teacherName} onChange={(e) => setTeacherName(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Email Address</label>
                    <input type="email" className="input" required placeholder="name@hnd.edu" disabled={modalMode === 'edit'} value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: modalMode === 'edit' ? 'var(--text-tertiary)' : 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Mobile Number</label>
                    <input type="text" className="input" value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Class Assignment</label>
                    <select value={teacherClassId} onChange={(e) => setTeacherClassId(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                      <option value="none">No Class Assignment</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>Class {c.name}-{c.section}</option>
                      ))}
                    </select>
                  </div>
                  {modalMode === 'add' && (
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                      <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Initial Account Password</label>
                      <input type="text" className="input" required value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Teacher</button>
                </div>
              </form>
            )}

            {/* Change Password Form */}
            {modalType === 'password' && (
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Setting password for: <strong>{selectedItem?.name}</strong> (<code>{selectedItem?.email}</code>)
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--space-md)' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>New Password</label>
                    <input 
                      type="text" 
                      className="input" 
                      required 
                      placeholder="At least 4 characters"
                      value={newPasswordValue} 
                      onChange={(e) => setNewPasswordValue(e.target.value)} 
                      style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortalPage;
