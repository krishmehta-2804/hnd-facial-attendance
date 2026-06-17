/**
 * HND Facial Attendance System - Demo Data
 * Comprehensive mock data for all components
 */
import { subDays, format } from 'date-fns';
import { ATTENDANCE_STATUS, USER_ROLES } from '../utils/constants';

// ─── Demo School ────────────────────────────────────────────
export const demoSchool = {
  id: 'school-001',
  name: 'Govt. Senior Secondary School, Karnal',
  code: 'GSSS-KNL-042',
  district: 'Karnal',
  block: 'Karnal',
  address: 'Near Bus Stand, Sector 12, Karnal, Haryana - 132001',
  phone: '+91-184-2251234',
  principalName: 'Dr. Sunita Sharma',
  establishedYear: 1985,
  academicYear: '2026-2027',
};

// ─── Demo Users ─────────────────────────────────────────────
export const demoUsers = [
  {
    id: 'user-001',
    name: 'Rajesh Kumar',
    email: 'teacher@hnd.edu',
    password: 'teacher123',
    role: USER_ROLES.TEACHER,
    schoolId: 'school-001',
    assignedClasses: ['class-1a', 'class-1b'],
    phone: '+91-98765-43210',
    avatar: 'RK',
  },
  {
    id: 'user-002',
    name: 'Dr. Sunita Sharma',
    email: 'headmaster@hnd.edu',
    password: 'headmaster123',
    role: USER_ROLES.HEADMASTER,
    schoolId: 'school-001',
    phone: '+91-98765-43211',
    avatar: 'SS',
  },
  {
    id: 'user-003',
    name: 'Anil Verma',
    email: 'admin@hnd.edu',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    schoolId: 'school-001',
    phone: '+91-98765-43212',
    avatar: 'AV',
  },
  {
    id: 'user-004',
    name: 'Meena Devi',
    email: 'parent@hnd.edu',
    password: 'parent123',
    role: USER_ROLES.PARENT,
    schoolId: 'school-001',
    childIds: ['student-001', 'student-015'],
    phone: '+91-98765-43213',
    avatar: 'MD',
  },
];

// ─── Demo Classes ───────────────────────────────────────────
export const demoClasses = [
  { id: 'class-1a', name: '1', section: 'A', grade: 1, schoolId: 'school-001', teacherId: 'user-001', teacherName: 'Rajesh Kumar' },
  { id: 'class-1b', name: '1', section: 'B', grade: 1, schoolId: 'school-001', teacherId: 'user-005', teacherName: 'Priya Singh' },
  { id: 'class-2a', name: '2', section: 'A', grade: 2, schoolId: 'school-001', teacherId: 'user-006', teacherName: 'Aman Gupta' },
  { id: 'class-2b', name: '2', section: 'B', grade: 2, schoolId: 'school-001', teacherId: 'user-007', teacherName: 'Kavita Rani' },
  { id: 'class-3a', name: '3', section: 'A', grade: 3, schoolId: 'school-001', teacherId: 'user-008', teacherName: 'Suresh Yadav' },
  { id: 'class-3b', name: '3', section: 'B', grade: 3, schoolId: 'school-001', teacherId: 'user-009', teacherName: 'Anita Malik' },
  { id: 'class-4a', name: '4', section: 'A', grade: 4, schoolId: 'school-001', teacherId: 'user-010', teacherName: 'Vikram Joshi' },
  { id: 'class-4b', name: '4', section: 'B', grade: 4, schoolId: 'school-001', teacherId: 'user-011', teacherName: 'Rekha Devi' },
];

// ─── Indian Names for Students ──────────────────────────────
const boyNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith',
  'Dhruv', 'Kabir', 'Ritvik', 'Aarush', 'Kayaan', 'Darsh', 'Veer', 'Sahil',
  'Rohan', 'Nikhil', 'Karan', 'Yash', 'Harsh', 'Dev', 'Ravi', 'Amit',
  'Sunil', 'Rahul', 'Vikash', 'Deepak', 'Mohit', 'Gaurav', 'Ankit', 'Kunal', 'Tarun',
];

const girlNames = [
  'Aanya', 'Saanvi', 'Aadya', 'Diya', 'Ananya', 'Aadhya', 'Pari', 'Myra',
  'Sara', 'Ira', 'Anika', 'Navya', 'Avni', 'Prisha', 'Kiara', 'Riya',
  'Sneha', 'Pooja', 'Nisha', 'Neha', 'Suman', 'Meena', 'Kavya', 'Tanvi',
  'Divya', 'Sakshi', 'Simran', 'Anjali', 'Priyanka', 'Muskan', 'Aisha',
  'Tanya', 'Palak', 'Komal', 'Shreya', 'Mansi', 'Jyoti', 'Shalini', 'Nidhi', 'Kriti',
];

const lastNames = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Yadav', 'Malik', 'Joshi',
  'Chauhan', 'Rajput', 'Pandit', 'Saini', 'Dahiya', 'Hooda', 'Tanwar',
  'Sangwan', 'Phogat', 'Sehrawat', 'Kadian', 'Dhull', 'Ahlawat', 'Dalal',
  'Sheoran', 'Godara', 'Punia', 'Mor', 'Deshwal', 'Jakhar', 'Gill', 'Rana',
];

// Generate students for each class
const generateStudents = () => {
  const students = [];
  let studentIndex = 0;

  demoClasses.forEach((cls) => {
    const count = 30 + Math.floor(Math.random() * 8); // 30-37 per class
    for (let i = 0; i < count; i++) {
      const isBoy = Math.random() > 0.48;
      const names = isBoy ? boyNames : girlNames;
      const firstName = names[Math.floor(Math.random() * names.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;

      students.push({
        id: `student-${String(studentIndex + 1).padStart(3, '0')}`,
        name,
        rollNo: i + 1,
        classId: cls.id,
        className: `${cls.name}-${cls.section}`,
        grade: cls.grade,
        section: cls.section,
        gender: isBoy ? 'male' : 'female',
        schoolId: 'school-001',
        parentPhone: `+91-${9000000000 + Math.floor(Math.random() * 999999999)}`,
        enrollmentDate: '2026-04-01',
        faceRegistered: Math.random() > 0.15,
        avatar: `${firstName[0]}${lastName[0]}`,
        feesPaid: [0, 200, 400, 600, 800, 1000][Math.floor(Math.random() * 6)],
      });
      studentIndex++;
    }
  });

  return students;
};

export const demoStudents = generateStudents();

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
        // Today: slightly higher absence for realism
        if (rand < 0.82) status = ATTENDANCE_STATUS.PRESENT;
        else if (rand < 0.92) status = ATTENDANCE_STATUS.ABSENT;
        else status = ATTENDANCE_STATUS.LATE;
      } else {
        // Historical
        if (rand < 0.85) status = ATTENDANCE_STATUS.PRESENT;
        else if (rand < 0.94) status = ATTENDANCE_STATUS.ABSENT;
        else status = ATTENDANCE_STATUS.LATE;
      }

      // Make some students consistently absent (chronic absentees)
      const studentNum = parseInt(student.id.split('-')[1]);
      if (studentNum % 47 === 0 && dayOffset < 5) {
        status = ATTENDANCE_STATUS.ABSENT;
      }

      const hour = 7 + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
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
        method: Math.random() > 0.3 ? 'facial' : 'manual',
        confidence: status !== ATTENDANCE_STATUS.ABSENT ? (0.75 + Math.random() * 0.24).toFixed(2) : null,
        timestamp: timestamp.toISOString(),
        markedBy: 'user-001',
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
    message: 'Aarav Sharma (3-A) absent for 5 consecutive days',
    studentName: 'Aarav Sharma',
    className: '3-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-2',
    type: 'low_attendance',
    severity: 'warning',
    message: 'Class 2-B attendance dropped below 75% today',
    className: '2-B',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-3',
    type: 'absence',
    severity: 'warning',
    message: 'Riya Gupta (1-A) absent for 3 consecutive days',
    studentName: 'Riya Gupta',
    className: '1-A',
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
  {
    id: 'alert-5',
    type: 'absence',
    severity: 'warning',
    message: 'Mohit Dahiya (4-A) absent for 4 consecutive days',
    studentName: 'Mohit Dahiya',
    className: '4-A',
    timestamp: new Date().toISOString(),
    read: false,
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
  { id: 1, action: 'Attendance marked', detail: 'Class 1-A (32 students)', user: 'Rajesh Kumar', time: '08:15 AM', type: 'attendance' },
  { id: 2, action: 'Attendance marked', detail: 'Class 1-B (29 students)', user: 'Priya Singh', time: '08:22 AM', type: 'attendance' },
  { id: 3, action: 'New student registered', detail: 'Ankit Saini added to Class 2-A', user: 'Admin', time: '09:00 AM', type: 'student' },
  { id: 4, action: 'Report generated', detail: 'Weekly attendance report', user: 'Dr. Sunita Sharma', time: '10:30 AM', type: 'report' },
  { id: 5, action: 'Alert triggered', detail: 'Low attendance in Class 2-B', user: 'System', time: '11:00 AM', type: 'alert' },
  { id: 6, action: 'Meal count updated', detail: '242 meals served today', user: 'System', time: '01:15 PM', type: 'meal' },
];
