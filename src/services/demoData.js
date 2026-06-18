/**
 * HND Facial Attendance System - Data Layer
 * Imports static school database from school_data.json and generates dynamic stats and logs
 */
import { subDays, format } from 'date-fns';
import { ATTENDANCE_STATUS } from '../utils/constants';
import schoolData from './school_data.json';

// Export static school config
export const demoSchool = schoolData.school;
export const demoClasses = schoolData.classes;
export const demoStudents = schoolData.students;

// Generate parent profiles dynamically from student records
// Parents can log in using:
// 1. Mobile number directly (e.g. 9599846877)
// 2. Child admission number directly (e.g. CSCBV-HR4237-25-14)
// Password for all parents is parent123
const generateParents = () => {
  const parentsList = [];
  const processedPhoneLogins = new Set();

  schoolData.students.forEach(student => {
    const cleanAdm = student.admissionNo.toLowerCase();
    
    // 1. Admission No Login (e.g. parent_cscbv-hr4237-25-14@hnd.edu)
    parentsList.push({
      id: `parent-adm-${cleanAdm}`,
      name: `Parent of ${student.name}`,
      email: `parent_${cleanAdm}@hnd.edu`,
      password: 'parent123',
      role: 'parent',
      schoolId: 'school-001',
      childIds: [student.id],
      phone: student.parentPhone,
      avatar: 'P',
    });

    // 2. Phone Number Login (e.g. 9599846877@hnd.edu)
    if (student.parentPhone && student.parentPhone.match(/^\d+$/) && !processedPhoneLogins.has(student.parentPhone)) {
      processedPhoneLogins.add(student.parentPhone);
      parentsList.push({
        id: `parent-phone-${student.parentPhone}`,
        name: `Parent of ${student.name}`,
        email: `${student.parentPhone}@hnd.edu`,
        password: 'parent123',
        role: 'parent',
        schoolId: 'school-001',
        childIds: [student.id],
        phone: student.parentPhone,
        avatar: 'P',
      });
    }
  });

  return parentsList;
};

// Export total users (Teachers + Admin + Headmaster + Parent accounts)
export const demoUsers = [
  ...schoolData.teachers,
  ...schoolData.otherUsers,
  ...generateParents()
];

// ─── Generate Attendance Records (30 days) ─────────────────
const generateAttendanceRecords = () => {
  const records = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = subDays(today, dayOffset);
    const dayOfWeek = date.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    const dateStr = format(date, 'yyyy-MM-dd');

    demoStudents.forEach((student) => {
      // Simulate realistic attendance patterns
      const rand = Math.random();
      let status;

      if (dayOffset === 0) {
        // Today: initially set everyone as absent (can be checked in present manually/facially)
        status = ATTENDANCE_STATUS.ABSENT; 
      } else {
        // Historical logs
        if (rand < 0.91) status = ATTENDANCE_STATUS.PRESENT;
        else if (rand < 0.97) status = ATTENDANCE_STATUS.ABSENT;
        else status = ATTENDANCE_STATUS.LATE;
      }

      const hour = 7;
      const minute = 45 + Math.floor(Math.random() * 25);
      const timestamp = new Date(date);
      timestamp.setHours(hour, minute, 0);

      records.push({
        id: `att-${dateStr}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        className: student.className,
        schoolId: 'school-001',
        date: dateStr,
        status,
        method: Math.random() > 0.4 ? 'facial' : 'manual',
        confidence: status !== ATTENDANCE_STATUS.ABSENT ? (0.78 + Math.random() * 0.21).toFixed(2) : null,
        timestamp: timestamp.toISOString(),
        markedBy: 'teacher-ritika',
      });
    });
  }

  return records;
};

export const demoAttendanceRecords = generateAttendanceRecords();

// ─── Pre-calculated Stats for Dashboard ─────────────────────
const calculateDemoStats = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecords = demoAttendanceRecords.filter((r) => r.date === today);

  const totalEnrolled = demoStudents.length;
  const presentToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
  const absentToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
  const lateToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const yesterdayRecords = demoAttendanceRecords.filter((r) => r.date === yesterday);
  const presentYesterday = yesterdayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;

  // Class-wise stats for today
  const classStats = demoClasses.map((cls) => {
    const classStudents = demoStudents.filter((s) => s.classId === cls.id);
    const classRecords = todayRecords.filter((r) => r.classId === cls.id);
    const present = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absent = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const late = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;
    const total = classStudents.length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100 * 10) / 10 : 0;

    return {
      classId: cls.id,
      className: cls.name === 'UKG' ? 'UKG-A' : `Class ${cls.name}-A`,
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
    const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
    const dayPresent = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const dayTotal = dayRecords.length;
    const pct = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100 * 10) / 10 : 0;

    trendData.push({
      date: dateStr,
      label: format(date, 'dd MMM'),
      shortLabel: format(date, 'dd'),
      present: dayPresent,
      total: dayTotal,
      percentage: pct,
    });
  }

  // Weekly data
  const weeklyData = [];
  for (let w = 3; w >= 0; w--) {
    let weekPresent = 0;
    let weekTotal = 0;
    for (let d = 0; d < 7; d++) {
      const date = subDays(new Date(), w * 7 + d);
      if (date.getDay() === 0) continue;
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
      weekPresent += dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      weekTotal += dayRecords.length;
    }
    weeklyData.push({
      label: `Week ${4 - w}`,
      present: weekPresent,
      total: weekTotal,
      percentage: weekTotal > 0 ? Math.round((weekPresent / weekTotal) * 100 * 10) / 10 : 0,
    });
  }

  return {
    totalEnrolled,
    presentToday,
    absentToday,
    lateToday,
    presentYesterday,
    attendancePercentage: totalEnrolled > 0 ? Math.round(((presentToday + lateToday) / totalEnrolled) * 100 * 10) / 10 : 0,
    classStats,
    trendData,
    weeklyData,
    todayRecords,
  };
};

export const demoStats = calculateDemoStats();

// ─── Demo Alerts ────────────────────────────────────────────
export const demoAlerts = [
  {
    id: 'alert-1',
    type: 'absence',
    severity: 'critical',
    message: 'Rohima Bashyal absent for 5 consecutive days',
    studentName: 'Rohima Bashyal',
    className: 'Class I-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-2',
    type: 'low_attendance',
    severity: 'warning',
    message: 'Class UKG-A attendance dropped below 75% today',
    className: 'UKG-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-3',
    type: 'absence',
    severity: 'warning',
    message: 'Anant Kumar absent for 3 consecutive days',
    studentName: 'Anant Kumar',
    className: 'Class I-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-4',
    type: 'system',
    severity: 'info',
    message: 'Face recognition models loaded successfully',
    timestamp: subDays(new Date(), 1).toISOString(),
    read: true,
  },
];

// ─── Demo Meal Data ─────────────────────────────────────────
export const demoMealData = (() => {
  const meals = [];
  for (let i = 0; i < 14; i++) {
    const date = subDays(new Date(), i);
    if (date.getDay() === 0) continue;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
    const present = dayRecords.filter((r) => r.status !== ATTENDANCE_STATUS.ABSENT).length;

    meals.push({
      id: `meal-${dateStr}`,
      date: dateStr,
      dateLabel: format(date, 'dd MMM'),
      totalPresent: present,
      mealsServed: present - Math.floor(Math.random() * 5),
      estimatedQuantityKg: Math.round(present * 0.15 * 10) / 10,
      actualQuantityKg: Math.round(present * 0.15 * 10) / 10 + (Math.random() * 2 - 1),
      wastageKg: Math.round(Math.random() * 3 * 10) / 10,
      costPerMeal: 34.5,
    });
  }
  return meals;
})();

// ─── Demo Recent Activity ───────────────────────────────────
export const demoRecentActivity = [
  { id: 1, action: 'Attendance marked', detail: 'Class I-A (13 students)', user: 'Ritika', time: '08:15 AM', type: 'attendance' },
  { id: 2, action: 'Attendance marked', detail: 'Class II-A (18 students)', user: 'Gayatree Sahoo', time: '08:22 AM', type: 'attendance' },
  { id: 3, action: 'New student registered', detail: 'Rohima Bashyal added to Class I-A', user: 'Admin', time: '09:00 AM', type: 'student' },
  { id: 4, action: 'Report generated', detail: 'Weekly attendance report', user: 'Ms. Seema', time: '10:30 AM', type: 'report' },
  { id: 5, action: 'Alert triggered', detail: 'Low attendance in Class UKG-A', user: 'System', time: '11:00 AM', type: 'alert' },
];
