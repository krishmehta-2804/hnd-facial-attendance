/**
 * HND Facial Attendance System - Date Utilities
 * Using date-fns for date manipulation
 */
import {
  format,
  parseISO,
  isToday,
  isYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSunday,
  differenceInDays,
  differenceInMinutes,
  subDays,
  addDays,
  getDay,
  isWithinInterval,
  formatDistanceToNow,
} from 'date-fns';
import { DATE_FORMATS } from './constants';

export const formatDate = (date, fmt = DATE_FORMATS.display) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, DATE_FORMATS.time);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, DATE_FORMATS.dateTime);
};

export const getToday = () => format(new Date(), DATE_FORMATS.input);

export const getTodayDisplay = () => format(new Date(), DATE_FORMATS.displayFull);

export const getWeekRange = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
};

export const getMonthRange = (date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

export const isSchoolDay = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return !isSunday(d);
};

export const getWorkingDaysInMonth = (date = new Date()) => {
  const { start, end } = getMonthRange(date);
  const days = eachDayOfInterval({ start, end });
  return days.filter((d) => isSchoolDay(d)).length;
};

export const getWorkingDaysInRange = (startDate, endDate) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter((d) => isSchoolDay(d)).length;
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getDaysInMonth = (date = new Date()) => {
  const { start, end } = getMonthRange(date);
  return eachDayOfInterval({ start, end });
};

export const getDayName = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE');
};

export const getConsecutiveAbsentDays = (attendanceHistory, studentId) => {
  const sorted = [...attendanceHistory]
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let count = 0;
  for (const record of sorted) {
    if (record.status === 'absent') {
      count++;
    } else {
      break;
    }
  }
  return count;
};

export {
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMinutes,
  subDays,
  addDays,
  getDay,
  isWithinInterval,
  parseISO,
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
};
