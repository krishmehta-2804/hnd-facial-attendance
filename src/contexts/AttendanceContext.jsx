/**
 * HND Facial Attendance System - Attendance Context
 */
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { demoAttendanceRecords, demoStudents, demoClasses, demoStats } from '../services/demoData';
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

  const markAttendance = useCallback((studentId, status, method = 'manual', confidence = null) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const record = {
      id: `att-${today}-${studentId}`,
      studentId,
      studentName: student.name,
      classId: student.classId,
      className: student.className,
      schoolId: 'school-001',
      date: today,
      status,
      method,
      confidence,
      timestamp: new Date().toISOString(),
      markedBy: 'current-user',
    };

    setRecords((prev) => {
      const existing = prev.findIndex(
        (r) => r.studentId === studentId && r.date === today
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = record;
        return updated;
      }
      return [...prev, record];
    });

    return record;
  }, [today, students]);

  const getStudentTodayStatus = useCallback(
    (studentId) => {
      const record = todayRecords.find((r) => r.studentId === studentId);
      return record?.status || null;
    },
    [todayRecords]
  );

  const getClassStudents = useCallback(
    (classId) => students.filter((s) => s.classId === classId),
    [students]
  );

  const getClassTodayStats = useCallback(
    (classId) => {
      const classStudents = students.filter((s) => s.classId === classId);
      const classRecords = todayRecords.filter((r) => r.classId === classId);
      return {
        total: classStudents.length,
        present: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length,
        absent: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length,
        late: classRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length,
      };
    },
    [students, todayRecords]
  );

  const value = {
    records,
    students,
    classes,
    todayRecords,
    stats: demoStats,
    markAttendance,
    getStudentTodayStatus,
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
