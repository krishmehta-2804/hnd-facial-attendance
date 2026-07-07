import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { demoAttendanceRecords, demoStudents, demoClasses, demoUsers } from '../services/demoData';
import { ATTENDANCE_STATUS } from '../utils/constants';
import db from '../services/offlineDB';

const AttendanceContext = createContext(null);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within AttendanceProvider');
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [records, setRecords] = useState(demoAttendanceRecords);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [mealsOrdered, setMealsOrdered] = useState({});

  const today = format(new Date(), 'yyyy-MM-dd');

  // Load and refresh student face-registration status from IndexedDB
  const refreshFaceRegistrations = useCallback(async () => {
    try {
      const stored = await db.faceDescriptors.toArray();
      const registeredIds = new Set(stored.map((d) => d.studentId));
      setStudents((prev) =>
        prev.map((s) => ({
          ...s,
          faceRegistered: registeredIds.has(s.id),
        }))
      );

      // Persist the faceRegistered flag to IndexedDB student records
      const allStudents = await db.students.toArray();
      const updatePromises = allStudents.map(async (student) => {
        const isRegistered = registeredIds.has(student.id);
        if (student.faceRegistered !== isRegistered) {
          await db.students.update(student.id, { faceRegistered: isRegistered });
        }
      });
      await Promise.all(updatePromises);
    } catch (err) {
      console.error('Failed to load face registrations from IndexedDB:', err);
    }
  }, []);

  // Fetch all students, classes, teachers, and attendance logs from local IndexedDB on mount
  useEffect(() => {
    const loadFromDB = async () => {
      try {
        // 1. Load Students
        let studentCount = await db.students.count();
        if (studentCount === 0) {
          await db.students.bulkAdd(demoStudents);
        }
        const loadedStudents = await db.students.toArray();
        setStudents(loadedStudents);

        // 2. Load Classes
        let classCount = await db.classes.count();
        if (classCount === 0) {
          await db.classes.bulkAdd(demoClasses);
        }
        const loadedClasses = await db.classes.toArray();
        setClasses(loadedClasses);

        // 3. Load Teachers
        let teacherCount = await db.teachers.count();
        if (teacherCount === 0) {
          const staticTeachers = demoUsers.filter(u => u.role === 'teacher');
          await db.teachers.bulkAdd(staticTeachers);
        }
        const loadedTeachers = await db.teachers.toArray();
        setTeachers(loadedTeachers);

        // 4. Load Attendance Records
        let attendanceCount = await db.attendance.count();
        if (attendanceCount === 0) {
          await db.attendance.bulkAdd(demoAttendanceRecords);
        }
        const loadedRecords = await db.attendance.toArray();
        setRecords(loadedRecords);

        // Sync face status
        await refreshFaceRegistrations();
      } catch (err) {
        console.error('Failed to load database from IndexedDB, falling back:', err);
        setStudents(demoStudents);
        setClasses(demoClasses);
        setTeachers(demoUsers.filter(u => u.role === 'teacher'));
        setRecords(demoAttendanceRecords);
      }
    };
    loadFromDB();
  }, [refreshFaceRegistrations]);

  const todayRecords = useMemo(
    () => records.filter((r) => r.date === today),
    [records, today]
  );

  // Dynamic Dashboard statistics computed from state
  const stats = useMemo(() => {
    const todayRecordsList = records.filter((r) => r.date === today);

    const totalEnrolled = students.length;
    const presentToday = todayRecordsList.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absentToday = todayRecordsList.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const lateToday = todayRecordsList.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;

    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const yesterdayRecords = records.filter((r) => r.date === yesterday);
    const presentYesterday = yesterdayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;

    // Class-wise stats for today
    const classStats = classes.map((cls) => {
      const classStudents = students.filter((s) => s.classId === cls.id);
      const classRecords = todayRecordsList.filter((r) => r.classId === cls.id);
      const present = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      const absent = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
      const late = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;
      const total = classStudents.length;
      const percentage = total > 0 ? Math.round(((present + late) / total) * 100 * 10) / 10 : 0;

      return {
        classId: cls.id,
        className: `${cls.name}-${cls.section}`,
        teacherName: cls.teacherName,
        total,
        present,
        absent,
        late,
        percentage,
      };
    });

    // Trend data (last 14 days)
    const trendData = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      if (date.getDay() === 0) continue;
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayRecords = records.filter((r) => r.date === dateStr);
      const dayPresent = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      const dayLate = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;

      trendData.push({
        date: dateStr,
        dateLabel: format(date, 'dd MMM'),
        present: dayPresent,
        late: dayLate,
        absent: records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT && r.date === dateStr).length,
      });
    }

    // Weekly data
    const weeklyData = [
      { name: 'Mon', present: Math.round(totalEnrolled * 0.9) },
      { name: 'Tue', present: Math.round(totalEnrolled * 0.92) },
      { name: 'Wed', present: Math.round(totalEnrolled * 0.88) },
      { name: 'Thu', present: Math.round(totalEnrolled * 0.94) },
      { name: 'Fri', present: Math.round(totalEnrolled * 0.91) },
      { name: 'Sat', present: Math.round(totalEnrolled * 0.85) },
    ];

    return {
      totalEnrolled,
      presentToday,
      absentToday,
      lateToday,
      presentYesterday,
      classStats,
      trendData,
      weeklyData,
    };
  }, [records, students, classes, today]);

  // Save meal ordered manually
  const saveMealsOrdered = useCallback((date, classId, quantity) => {
    setMealsOrdered((prev) => ({
      ...prev,
      [`${date}_${classId}`]: quantity,
    }));
  }, []);

  // Record student fee payment
  const recordFeePayment = useCallback((studentId, amount, remarks = '') => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedFeesPaid = (s.feesPaid || 0) + amount;
          const newPayments = s.feePayments ? [...s.feePayments] : [];
          newPayments.push({
            date: format(new Date(), 'yyyy-MM-dd HH:mm'),
            amount,
            remarks: remarks || 'Payment received'
          });

          db.students.update(studentId, { 
            feesPaid: updatedFeesPaid,
            feePayments: newPayments
          });

          return {
            ...s,
            feesPaid: updatedFeesPaid,
            feePayments: newPayments
          };
        }
        return s;
      })
    );
  }, []);

  // Get gender-wise enrollment and attendance stats
  const getGenderStats = useCallback(
    (classId, date = today) => {
      const classStudents = students.filter((s) => s.classId === classId || classId === 'all');
      const classRecords = records.filter((r) => (r.classId === classId || classId === 'all') && r.date === date);

      const enrolledBoys = classStudents.filter((s) => s.gender === 'male').length;
      const enrolledGirls = classStudents.filter((s) => s.gender === 'female').length;

      const presentBoys = classRecords.filter((r) => {
        if (r.status === ATTENDANCE_STATUS.ABSENT) return false;
        const stud = classStudents.find((s) => s.id === r.studentId);
        return stud?.gender === 'male';
      }).length;

      const presentGirls = classRecords.filter((r) => {
        if (r.status === ATTENDANCE_STATUS.ABSENT) return false;
        const stud = classStudents.find((s) => s.id === r.studentId);
        return stud?.gender === 'female';
      }).length;

      return {
        enrolledBoys,
        enrolledGirls,
        presentBoys,
        presentGirls,
        absentBoys: enrolledBoys - presentBoys,
        absentGirls: enrolledGirls - presentGirls,
      };
    },
    [students, records, today]
  );

  const markAttendance = useCallback(
    (studentId, status, method = 'manual', confidence = null, date = today) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return;

      const record = {
        id: `att-${date}-${studentId}`,
        studentId,
        studentName: student.name,
        classId: student.classId,
        className: student.className,
        schoolId: 'school-001',
        date,
        status,
        method,
        confidence,
        timestamp: new Date().toISOString(),
        markedBy: 'current-user',
      };

      setRecords((prev) => {
        const existing = prev.findIndex(
          (r) => r.studentId === studentId && r.date === date
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = record;
          return updated;
        }
        return [...prev, record];
      });

      // Persist the attendance record locally
      db.attendance.put(record).catch((err) => {
        console.error('Failed to save attendance record locally:', err);
      });

      return record;
    },
    [today, students]
  );

  const getStudentTodayStatus = useCallback(
    (studentId) => {
      const record = todayRecords.find((r) => r.studentId === studentId);
      return record?.status || null;
    },
    [todayRecords]
  );

  const getStudentStatusByDate = useCallback(
    (studentId, date) => {
      const record = records.find((r) => r.studentId === studentId && r.date === date);
      return record?.status || null;
    },
    [records]
  );

  const getClassStudents = useCallback(
    (classId) => students.filter((s) => s.classId === classId),
    [students]
  );

  const getClassTodayStats = useCallback(
    (classId, date = today) => {
      const classStudents = students.filter((s) => s.classId === classId);
      const classRecords = records.filter((r) => r.classId === classId && r.date === date);
      return {
        total: classStudents.length,
        present: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length,
        absent: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length,
        late: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length,
      };
    },
    [students, records, today]
  );

  // ─── CRUD Student Database Methods ──────────────────────
  const addStudent = useCallback(async (student) => {
    try {
      await db.students.add(student);
      const loaded = await db.students.toArray();
      setStudents(loaded);
      await refreshFaceRegistrations();
    } catch (e) {
      console.error('Failed to add student:', e);
      throw e;
    }
  }, [refreshFaceRegistrations]);

  const updateStudent = useCallback(async (studentId, updatedData) => {
    try {
      await db.students.update(studentId, updatedData);
      const loaded = await db.students.toArray();
      setStudents(loaded);
      await refreshFaceRegistrations();
    } catch (e) {
      console.error('Failed to update student:', e);
      throw e;
    }
  }, [refreshFaceRegistrations]);

  const deleteStudent = useCallback(async (studentId) => {
    try {
      await db.students.delete(studentId);
      await db.faceDescriptors.where('studentId').equals(studentId).delete();
      const loaded = await db.students.toArray();
      setStudents(loaded);
      await refreshFaceRegistrations();
    } catch (e) {
      console.error('Failed to delete student:', e);
      throw e;
    }
  }, [refreshFaceRegistrations]);

  // ─── CRUD Teacher Database Methods ──────────────────────
  const addTeacher = useCallback(async (teacher, password = 'teacher123') => {
    try {
      await db.teachers.add(teacher);
      await db.users.add({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        password: password,
        role: 'teacher',
        schoolId: 'school-001',
        phone: teacher.phone,
        avatar: teacher.avatar,
        assignedClasses: teacher.assignedClasses || []
      });
      const loaded = await db.teachers.toArray();
      setTeachers(loaded);
    } catch (e) {
      console.error('Failed to add teacher:', e);
      throw e;
    }
  }, []);

  const updateTeacher = useCallback(async (teacherId, updatedData) => {
    try {
      await db.teachers.update(teacherId, updatedData);
      
      const userUpdates = {};
      if (updatedData.name) userUpdates.name = updatedData.name;
      if (updatedData.email) userUpdates.email = updatedData.email;
      if (updatedData.phone) userUpdates.phone = updatedData.phone;
      if (updatedData.avatar) userUpdates.avatar = updatedData.avatar;
      if (updatedData.assignedClasses) userUpdates.assignedClasses = updatedData.assignedClasses;
      
      if (Object.keys(userUpdates).length > 0) {
        await db.users.update(teacherId, userUpdates);
      }
      const loaded = await db.teachers.toArray();
      setTeachers(loaded);
    } catch (e) {
      console.error('Failed to update teacher:', e);
      throw e;
    }
  }, []);

  const deleteTeacher = useCallback(async (teacherId) => {
    try {
      await db.teachers.delete(teacherId);
      await db.users.delete(teacherId);
      const loaded = await db.teachers.toArray();
      setTeachers(loaded);
    } catch (e) {
      console.error('Failed to delete teacher:', e);
      throw e;
    }
  }, []);

  // ─── Class-Teacher Assignment Method ───────────────────
  const updateClassTeacher = useCallback(async (classId, teacherId, teacherName) => {
    try {
      await db.classes.update(classId, { teacherId, teacherName });
      const loaded = await db.classes.toArray();
      setClasses(loaded);
    } catch (e) {
      console.error('Failed to update class teacher:', e);
      throw e;
    }
  }, []);

  // ─── CRUD User Database Methods (Admin Roster Console) ───────────────────
  const addUser = useCallback(async (user, password) => {
    try {
      const initials = user.name.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0,2).toUpperCase();
      await db.users.add({
        id: user.id,
        name: user.name,
        email: user.email,
        password: password,
        role: user.role,
        schoolId: 'school-001',
        phone: user.phone || '',
        avatar: initials,
        assignedClasses: user.assignedClasses || []
      });

      if (user.role === 'teacher') {
        await db.teachers.add({
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'teacher',
          schoolId: 'school-001',
          assignedClasses: user.assignedClasses || [],
          phone: user.phone || '',
          avatar: initials
        });
        const loaded = await db.teachers.toArray();
        setTeachers(loaded);
      }
    } catch (e) {
      console.error('Failed to add user to IndexedDB:', e);
      throw e;
    }
  }, []);

  const updateUser = useCallback(async (userId, updatedFields) => {
    try {
      const oldUser = await db.users.get(userId);
      if (!oldUser) throw new Error('User not found');
      
      await db.users.update(userId, updatedFields);
      const newUser = await db.users.get(userId);

      // Handle role transition to/from teacher, or synchronize teacher details
      if (oldUser.role === 'teacher' && newUser.role !== 'teacher') {
        await db.teachers.delete(userId);
        const loaded = await db.teachers.toArray();
        setTeachers(loaded);
      } else if (oldUser.role !== 'teacher' && newUser.role === 'teacher') {
        const initials = newUser.name.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0,2).toUpperCase();
        await db.teachers.add({
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: 'teacher',
          schoolId: 'school-001',
          assignedClasses: newUser.assignedClasses || [],
          phone: newUser.phone || '',
          avatar: initials
        });
        const loaded = await db.teachers.toArray();
        setTeachers(loaded);
      } else if (newUser.role === 'teacher') {
        const teacherUpdates = {};
        if (updatedFields.name) teacherUpdates.name = updatedFields.name;
        if (updatedFields.email) teacherUpdates.email = updatedFields.email;
        if (updatedFields.phone) teacherUpdates.phone = updatedFields.phone;
        if (updatedFields.avatar) teacherUpdates.avatar = updatedFields.avatar;
        if (updatedFields.assignedClasses) teacherUpdates.assignedClasses = updatedFields.assignedClasses;

        if (Object.keys(teacherUpdates).length > 0) {
          await db.teachers.update(userId, teacherUpdates);
          const loaded = await db.teachers.toArray();
          setTeachers(loaded);
        }
      }
    } catch (e) {
      console.error('Failed to update user in IndexedDB:', e);
      throw e;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const user = await db.users.get(userId);
      await db.users.delete(userId);
      if (user && user.role === 'teacher') {
        await db.teachers.delete(userId);
        const loaded = await db.teachers.toArray();
        setTeachers(loaded);
      }
    } catch (e) {
      console.error('Failed to delete user from IndexedDB:', e);
      throw e;
    }
  }, []);

  const value = {
    records,
    students,
    classes,
    teachers,
    todayRecords,
    stats,
    mealsOrdered,
    saveMealsOrdered,
    recordFeePayment,
    getGenderStats,
    markAttendance,
    getStudentTodayStatus,
    getStudentStatusByDate,
    getClassStudents,
    getClassTodayStats,
    refreshFaceRegistrations,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    updateClassTeacher,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
