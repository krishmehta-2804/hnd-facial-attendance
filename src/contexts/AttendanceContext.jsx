import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { demoAttendanceRecords, demoStudents, demoClasses } from '../services/demoData';
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
  const [students, setStudents] = useState(demoStudents);
  const [classes] = useState(demoClasses);
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
    } catch (err) {
      console.error('Failed to load face registrations from IndexedDB:', err);
    }
  }, []);

  // Check face registrations on mount
  useEffect(() => {
    refreshFaceRegistrations();
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
        absent: dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length,
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
  const recordFeePayment = useCallback((studentId, amount) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, feesPaid: (s.feesPaid || 0) + amount } : s
      )
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

  const value = {
    records,
    students,
    classes,
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
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
