/**
 * HND Facial Attendance System - Attendance Calculations
 */

export const calculateAttendancePercentage = (present, total) => {
  if (!total || total === 0) return 0;
  return Math.round((present / total) * 100 * 10) / 10;
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return { label: 'Excellent', color: 'success', icon: '🟢' };
  if (percentage >= 75) return { label: 'Good', color: 'warning', icon: '🟡' };
  if (percentage >= 50) return { label: 'Poor', color: 'danger', icon: '🔴' };
  return { label: 'Critical', color: 'danger', icon: '🔴' };
};

export const calculateClassStats = (students, attendanceRecords, dateStr) => {
  const dayRecords = attendanceRecords.filter((r) => r.date === dateStr);
  const present = dayRecords.filter((r) => r.status === 'present').length;
  const absent = dayRecords.filter((r) => r.status === 'absent').length;
  const late = dayRecords.filter((r) => r.status === 'late').length;
  const total = students.length;
  const percentage = calculateAttendancePercentage(present + late, total);

  return { total, present, absent, late, percentage };
};

export const calculateSchoolStats = (classStatsArray) => {
  const totals = classStatsArray.reduce(
    (acc, cls) => ({
      total: acc.total + cls.total,
      present: acc.present + cls.present,
      absent: acc.absent + cls.absent,
      late: acc.late + cls.late,
    }),
    { total: 0, present: 0, absent: 0, late: 0 }
  );
  totals.percentage = calculateAttendancePercentage(totals.present + totals.late, totals.total);
  return totals;
};

export const calculateMealRequirement = (presentCount, mealPerStudent = 1) => {
  const estimatedMeals = presentCount * mealPerStudent;
  const bufferPercentage = 0.05;
  const buffer = Math.ceil(estimatedMeals * bufferPercentage);
  return {
    required: estimatedMeals,
    withBuffer: estimatedMeals + buffer,
    buffer,
  };
};

export const getAbsenteeAlerts = (students, attendanceRecords, thresholdDays = 3) => {
  const alerts = [];
  const today = new Date();

  students.forEach((student) => {
    const studentRecords = attendanceRecords
      .filter((r) => r.studentId === student.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let consecutiveAbsent = 0;
    for (const record of studentRecords) {
      if (record.status === 'absent') {
        consecutiveAbsent++;
      } else {
        break;
      }
    }

    if (consecutiveAbsent >= thresholdDays) {
      alerts.push({
        id: `alert-${student.id}`,
        type: 'absence',
        severity: consecutiveAbsent >= 5 ? 'critical' : 'warning',
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        message: `${student.name} (${student.className}) has been absent for ${consecutiveAbsent} consecutive days`,
        consecutiveDays: consecutiveAbsent,
        timestamp: today.toISOString(),
      });
    }
  });

  return alerts.sort((a, b) => b.consecutiveDays - a.consecutiveDays);
};

export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return { direction: 'neutral', value: 0 };
  const diff = ((current - previous) / previous) * 100;
  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    value: Math.abs(Math.round(diff * 10) / 10),
  };
};

export const calculateStudentAttendanceStats = (studentId, attendanceRecords) => {
  const records = attendanceRecords.filter((r) => r.studentId === studentId);
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'late').length;
  const total = records.length;
  const percentage = calculateAttendancePercentage(present + late, total);

  return { present, absent, late, total, percentage };
};
