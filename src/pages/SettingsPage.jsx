/**
 * Settings Page - System configurations, Timings, and Admin Database Management
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { SCHOOL_CONFIG, FACE_DETECTION_CONFIG, ROUTES } from '../utils/constants';
import db from '../services/offlineDB';
import { 
  Save, School, Clock, Camera, ShieldAlert, CloudLightning, 
  ToggleLeft, ToggleRight, Check, Database, Plus, Edit2, Trash2, Key, X, Search
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, updatePassword } = useAuth();
  const { 
    students, classes, teachers,
    addStudent, updateStudent, deleteStudent,
    addTeacher, updateTeacher, deleteTeacher,
    updateClassTeacher,
    addUser, updateUser, deleteUser
  } = useAttendance();
  
  // Tabs: general, attendance, facial, sync, manage_data
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Settings saved!');

  // Config states
  const [schoolName, setSchoolName] = useState(SCHOOL_CONFIG.name);
  const [academicYear, setAcademicYear] = useState(SCHOOL_CONFIG.academicYear);
  const [startTime, setStartTime] = useState(SCHOOL_CONFIG.schoolStartTime);
  const [endTime, setEndTime] = useState(SCHOOL_CONFIG.schoolEndTime);
  const [lateThreshold, setLateThreshold] = useState(SCHOOL_CONFIG.lateThresholdMinutes);
  const [minAttendance, setMinAttendance] = useState(SCHOOL_CONFIG.minAttendancePercentage);
  const [faceThreshold, setFaceThreshold] = useState(FACE_DETECTION_CONFIG.threshold);
  const [offlineSync, setOfflineSync] = useState(true);

  // Admin Data Manager States
  const [dataSubTab, setDataSubTab] = useState('students'); // 'students', 'teachers', 'passwords'
  const [dbUsers, setDbUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

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
  const [teacherClassId, setTeacherClassId] = useState('');

  // Password Form States
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // User Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('teacher');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const openAddUser = () => {
    setUserName('');
    setUserEmail('');
    setUserRole('teacher');
    setUserPassword('');
    setUserPhone('');
    setModalType('user');
    setModalMode('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditUser = (user) => {
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserPassword(user.password || '');
    setUserPhone(user.phone || '');
    setModalType('user');
    setModalMode('edit');
    setSelectedItem(user);
    setShowModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add' && (!userPassword.trim() || userPassword.length < 4)) {
      alert('Password must be at least 4 characters long.');
      return;
    }

    const initials = userName.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0,2).toUpperCase();
    const cleanEmail = userEmail.trim().toLowerCase();
    
    // Generate id safely based on role and email if adding new
    const cleanId = modalMode === 'add' ? `${userRole}-${cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '')}` : selectedItem.id;

    const userData = {
      id: cleanId,
      name: userName.trim(),
      email: cleanEmail,
      role: userRole,
      phone: userPhone.trim(),
      avatar: initials,
      assignedClasses: modalMode === 'add' ? [] : selectedItem.assignedClasses || []
    };

    try {
      if (modalMode === 'add') {
        // Check if user already exists
        const existing = await db.users.get(userData.id);
        if (existing) {
          alert(`Error: A user with ID/Email "${userData.email}" already exists.`);
          return;
        }
        await addUser(userData, userPassword.trim());
        setSuccessMsg(`User "${userName}" successfully added.`);
      } else {
        const updatedFields = {
          name: userName.trim(),
          email: cleanEmail,
          role: userRole,
          phone: userPhone.trim(),
          avatar: initials
        };
        if (userPassword.trim()) {
          updatedFields.password = userPassword.trim();
        }
        await updateUser(selectedItem.id, updatedFields);
        setSuccessMsg(`User "${userName}" details updated.`);
      }
      await loadDbUsers();
      setShowModal(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Database Error: ${err.message || err.toString()}`);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (confirm(`Are you sure you want to delete user "${name}"? This will delete their account and logins.`)) {
      try {
        await deleteUser(userId);
        await loadDbUsers();
        setSuccessMsg(`User "${name}" deleted.`);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        alert(`Error: ${err.message || err.toString()}`);
      }
    }
  };

  // Load all system credentials for management
  const loadDbUsers = async () => {
    try {
      const users = await db.users.toArray();
      setDbUsers(users);
    } catch (e) {
      console.error('Failed to load credentials list:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage_data' || dataSubTab === 'passwords') {
      loadDbUsers();
    }
  }, [activeTab, dataSubTab]);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Settings saved!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // ─── Search & Filters for Data Management ─────────────────────
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

  const getCurrentTargetDue = () => {
    const currentMonth = new Date().getMonth();
    let monthsElapsed = currentMonth - 3;
    if (monthsElapsed < 0) monthsElapsed += 12;
    monthsElapsed += 1;
    return monthsElapsed * 200;
  };

  // ─── Modal Actions ───────────────────────────────────────────
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
    setTeacherClassId(classes[0]?.id || 'none');
    
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

  // ─── CRUD Submit Handlers ─────────────────────────────────────
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
        setSuccessMsg(`Student "${studentName}" updated successfully.`);
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
        // Also map teacher to class if assigned
        if (teacherClassId !== 'none') {
          await updateClassTeacher(teacherClassId, teacherData.id, `${teacherName} (Assigned)`);
        }
        setSuccessMsg(`Teacher "${teacherName}" added.`);
      } else {
        await updateTeacher(selectedItem.id, teacherData);
        if (teacherClassId !== 'none') {
          await updateClassTeacher(teacherClassId, selectedItem.id, `${teacherName} (Assigned)`);
        }
        setSuccessMsg(`Teacher "${teacherName}" details updated.`);
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
    if (confirm(`Are you sure you want to delete student "${name}"? This will also wipe their face descriptors.`)) {
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
    if (confirm(`Are you sure you want to delete teacher "${name}"? This removes their account, logins, and class assignments.`)) {
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
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure academic calendars, thresholds, and manage school directory database</p>
        </div>
        <div className="page-actions">
          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}
          {activeTab !== 'manage_data' && (
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} />
              Save Settings
            </button>
          )}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: 'var(--space-xl)', marginTop: 'var(--space-lg)', alignItems: 'start' }}>
        {/* Sidebar tabs */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('general')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <School size={16} />
              <span>School Profile</span>
            </button>
            <button
              className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('attendance')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <Clock size={16} />
              <span>Timings & Thresholds</span>
            </button>
            <button
              className={`btn ${activeTab === 'facial' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('facial')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <Camera size={16} />
              <span>Facial Recognition</span>
            </button>
            <button
              className={`btn ${activeTab === 'sync' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('sync')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <CloudLightning size={16} />
              <span>Database & Sync</span>
            </button>
            {currentUser?.role === 'admin' && (
              <button
                className={`btn ${activeTab === 'manage_data' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('manage_data')}
                style={{ justifyContent: 'flex-start', gap: '10px', marginTop: 'var(--space-sm)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)' }}
              >
                <Database size={16} />
                <span>Manage Database</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab contents */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          {activeTab === 'general' && (
            <form onSubmit={handleSave}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>School Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Name</label>
                  <input
                    type="text"
                    className="input"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Code</label>
                  <input
                    type="text"
                    className="input"
                    defaultValue={SCHOOL_CONFIG.code}
                    disabled
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Academic Year</label>
                  <input
                    type="text"
                    className="input"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>District</label>
                  <input
                    type="text"
                    className="input"
                    defaultValue="Karnal"
                    disabled
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'attendance' && (
            <form onSubmit={handleSave}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Timings & Attendance Rules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Start Time</label>
                  <input
                    type="time"
                    className="input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School End Time</label>
                  <input
                    type="time"
                    className="input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Late Grace Period (Minutes)</label>
                  <input
                    type="number"
                    className="input"
                    value={lateThreshold}
                    onChange={(e) => setLateThreshold(Number(e.target.value))}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Minimum Required Attendance %</label>
                  <input
                    type="number"
                    className="input"
                    value={minAttendance}
                    onChange={(e) => setMinAttendance(Number(e.target.value))}
                    style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'facial' && (
            <form onSubmit={handleSave}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Facial Recognition Config</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Detection Confidence Threshold (0.1 - 1.0)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={faceThreshold}
                      onChange={(e) => setFaceThreshold(parseFloat(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontWeight: 'bold', minWidth: '40px' }}>{faceThreshold}</span>
                  </div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Higher values reduce false positives but might miss faces. Recommended: 0.5 - 0.6.</span>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'sync' && (
            <form onSubmit={handleSave}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Centralized Database & Offline Sync</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Offline Mode / Local Cache</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Allow database sync to wait until stable internet is active</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOfflineSync(!offlineSync)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}
                  >
                    {offlineSync ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-md)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius)', color: 'var(--accent-light)' }}>
                  <ShieldAlert size={20} />
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>
                    Firebase central DB credentials can be configured using environment variables like <code>VITE_FIREBASE_API_KEY</code>.
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* Database management console for admins */}
          {activeTab === 'manage_data' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', pb: 'var(--space-md)', mb: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                {/* sub-tabs */}
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

                {/* Add actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-ghost"
                    onClick={() => navigate(ROUTES.ADMIN_PORTAL)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', border: '1px solid var(--border)' }}
                  >
                    <Database size={16} />
                    <span>Open Standalone Portal</span>
                  </button>
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
                  {dataSubTab === 'passwords' && (
                    <button className="btn btn-primary" onClick={openAddUser}>
                      <Plus size={16} />
                      Add User
                    </button>
                  )}
                </div>
              </div>

              {/* Filters toolbar */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder={`Search ${dataSubTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
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

              {/* Table rendering */}
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
                        <th>Name</th>
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
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => openEditUser(u)} title="Edit User">
                                <Edit2 size={14} style={{ color: 'var(--accent)' }} />
                              </button>
                              {currentUser.id !== u.id && (
                                <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => handleDeleteUser(u.id, u.name)} title="Delete User">
                                  <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                                </button>
                              )}
                            </div>
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
          )}
        </div>
      </div>

      {/* Database CRUD Modals */}
      {showModal && (
        <div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
          <div className="modal glass" style={{ maxWidth: '600px', display: 'block', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
              <h3 style={{ margin: 0 }}>
                {modalType === 'student' && `${modalMode === 'add' ? 'Add' : 'Edit'} Student`}
                {modalType === 'teacher' && `${modalMode === 'add' ? 'Add' : 'Edit'} Teacher`}
                {modalType === 'user' && `${modalMode === 'add' ? 'Add' : 'Edit'} User`}
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

            {/* User Add/Edit Form */}
            {modalType === 'user' && (
              <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Full Name</label>
                    <input type="text" className="input" required value={userName} onChange={(e) => setUserName(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Email (Login ID)</label>
                    <input type="email" className="input" required placeholder="user@hnd.edu" disabled={modalMode === 'edit'} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: modalMode === 'edit' ? 'var(--text-tertiary)' : 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Role</label>
                    <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                      <option value="teacher">Teacher</option>
                      <option value="headmaster">Headmaster</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Password</label>
                    <input type="text" className="input" required={modalMode === 'add'} placeholder={modalMode === 'edit' ? "Leave empty to keep same" : "At least 4 characters"} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Mobile Number (Optional)</label>
                    <input type="text" className="input" placeholder="10-digit number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Add User' : 'Save Changes'}</button>
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

export default SettingsPage;
