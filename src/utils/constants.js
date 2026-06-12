/**
 * HND Facial Attendance System - Constants
 * App-wide constants and configuration defaults
 */

// ─── User Roles ────────────────────────────────────────────
export const USER_ROLES = Object.freeze({
  TEACHER: 'teacher',
  HEADMASTER: 'headmaster',
  ADMIN: 'admin',
  PARENT: 'parent',
});

export const ROLE_LABELS = Object.freeze({
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.HEADMASTER]: 'Headmaster',
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.PARENT]: 'Parent',
});

export const ROLE_PERMISSIONS = Object.freeze({
  [USER_ROLES.TEACHER]: [
    'view_own_class',
    'mark_attendance',
    'view_reports',
    'register_face',
  ],
  [USER_ROLES.HEADMASTER]: [
    'view_all_classes',
    'mark_attendance',
    'view_reports',
    'view_analytics',
    'manage_teachers',
    'register_face',
    'export_data',
    'view_meal_data',
  ],
  [USER_ROLES.ADMIN]: [
    'view_all_classes',
    'mark_attendance',
    'view_reports',
    'view_analytics',
    'manage_teachers',
    'manage_students',
    'manage_school',
    'register_face',
    'export_data',
    'view_meal_data',
    'system_settings',
  ],
  [USER_ROLES.PARENT]: [
    'view_own_child',
    'view_child_attendance',
  ],
});

// ─── Attendance Status ─────────────────────────────────────
export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
});

export const ATTENDANCE_STATUS_LABELS = Object.freeze({
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
});

export const ATTENDANCE_STATUS_COLORS = Object.freeze({
  [ATTENDANCE_STATUS.PRESENT]: '#10B981',
  [ATTENDANCE_STATUS.ABSENT]: '#EF4444',
  [ATTENDANCE_STATUS.LATE]: '#F59E0B',
});

// ─── Attendance Methods ────────────────────────────────────
export const ATTENDANCE_METHOD = Object.freeze({
  FACIAL: 'facial',
  MANUAL: 'manual',
});

export const ATTENDANCE_METHOD_LABELS = Object.freeze({
  [ATTENDANCE_METHOD.FACIAL]: 'Facial Recognition',
  [ATTENDANCE_METHOD.MANUAL]: 'Manual Entry',
});

// ─── Route Paths ───────────────────────────────────────────
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  ATTENDANCE_MARK: '/attendance/mark',
  ATTENDANCE_HISTORY: '/attendance/history',
  FACE_REGISTER: '/face-register',
  STUDENTS: '/students',
  STUDENT_DETAIL: '/students/:id',
  CLASSES: '/classes',
  CLASS_DETAIL: '/classes/:id',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  MEAL_TRACKING: '/meal-tracking',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOT_FOUND: '*',
});

// ─── School Configuration Defaults ─────────────────────────
export const SCHOOL_CONFIG = Object.freeze({
  name: 'HND Public School',
  code: 'HND-001',
  academicYear: '2026-2027',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  holidays: [], // Populated from school calendar
  schoolStartTime: '08:00',
  schoolEndTime: '14:00',
  lateThresholdMinutes: 15,
  attendanceWindowMinutes: 60, // Time window for marking attendance
  minAttendancePercentage: 75, // Minimum required attendance
  alertThresholdDays: 3, // Consecutive absent days before alert
  mealTrackingEnabled: true,
  facialRecognitionEnabled: true,
  classesPerGrade: 2, // A and B sections
  totalGrades: 4, // 1st to 4th grade
});

// ─── Face Detection Configuration ──────────────────────────
export const FACE_DETECTION_CONFIG = Object.freeze({
  threshold: 0.5,
  inputSize: 224,
  scoreThreshold: 0.5,
  maxDescriptorDistance: 0.6,
  minConfidence: 0.5,
  modelPath: '/models',
  captureCount: 5, // Number of face captures for registration
  captureInterval: 500, // ms between captures
  videoWidth: 640,
  videoHeight: 480,
});

// ─── API Configuration ─────────────────────────────────────
export const API_CONFIG = Object.freeze({
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  batchSize: 50,
});

// ─── Chart Colors ──────────────────────────────────────────
export const CHART_COLORS = Object.freeze({
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  slate: '#64748B',
  gradientStart: 'rgba(59, 130, 246, 0.3)',
  gradientEnd: 'rgba(59, 130, 246, 0.0)',
});

// ─── Notification Types ────────────────────────────────────
export const NOTIFICATION_TYPES = Object.freeze({
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
});

// ─── Date Formats ──────────────────────────────────────────
export const DATE_FORMATS = Object.freeze({
  display: 'dd MMM yyyy',
  displayFull: 'EEEE, dd MMMM yyyy',
  input: 'yyyy-MM-dd',
  time: 'hh:mm a',
  dateTime: 'dd MMM yyyy, hh:mm a',
  monthYear: 'MMMM yyyy',
  dayMonth: 'dd MMM',
});

// ─── Storage Keys ──────────────────────────────────────────
export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'hnd_auth_token',
  USER_DATA: 'hnd_user_data',
  THEME: 'hnd_theme',
  LAST_SYNC: 'hnd_last_sync',
  OFFLINE_QUEUE: 'hnd_offline_queue',
});

export default {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_COLORS,
  ATTENDANCE_METHOD,
  ATTENDANCE_METHOD_LABELS,
  ROUTES,
  SCHOOL_CONFIG,
  FACE_DETECTION_CONFIG,
  API_CONFIG,
  CHART_COLORS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  STORAGE_KEYS,
};
