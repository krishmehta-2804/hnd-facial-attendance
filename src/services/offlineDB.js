/**
 * Offline DB Service - Local storage with Dexie.js IndexedDB
 */
import Dexie from 'dexie';

// Initialize Dexie Database
export const db = new Dexie('HNDAttendanceDB');

// Define schema structures:
// version 2: added teachers, classes, users for client-side administration
db.version(2).stores({
  students: 'id, name, rollNo, classId, className, faceRegistered, parentPhone',
  teachers: 'id, name, email, role, phone',
  classes: 'id, name, teacherId',
  users: 'id, email, password, role',
  faceDescriptors: 'id, studentId, descriptor',
  pendingAttendance: 'id, studentId, studentName, status, date, timestamp, synced',
  cachedData: 'key, value, updatedAt',
});

// version 3: added persistent attendance records table
db.version(3).stores({
  students: 'id, name, rollNo, classId, className, faceRegistered, parentPhone',
  teachers: 'id, name, email, role, phone',
  classes: 'id, name, teacherId',
  users: 'id, email, password, role',
  faceDescriptors: 'id, studentId, descriptor',
  pendingAttendance: 'id, studentId, studentName, status, date, timestamp, synced',
  cachedData: 'key, value, updatedAt',
  attendance: 'id, studentId, classId, date, status'
});

// Check database version and wipe legacy mock data to prevent sync/roster glitches
const DB_VERSION_KEY = 'hnd_db_roster_schema_v3';
if (localStorage.getItem(DB_VERSION_KEY) !== 'v3') {
  db.on('ready', async () => {
    try {
      console.log('Database schema update or legacy data detected. Wiping IndexedDB to load official 94-student roster...');
      await Promise.all([
        db.students.clear(),
        db.teachers.clear(),
        db.classes.clear(),
        db.users.clear(),
        db.faceDescriptors.clear(),
        db.pendingAttendance.clear()
      ]);
      localStorage.setItem(DB_VERSION_KEY, 'v3');
      console.log('Database wiped successfully. The app will now seed official roster.');
    } catch (e) {
      console.error('Failed to wipe legacy IndexedDB:', e);
    }
  });
}

// Helper: Add attendance record to sync queue when offline
export const addToPendingQueue = async (attendanceRecord) => {
  try {
    await db.pendingAttendance.put({
      ...attendanceRecord,
      synced: 0,
    });
    console.log('Attendance saved locally for sync:', attendanceRecord.studentName);
  } catch (err) {
    console.error('Failed to save to local sync queue:', err);
  }
};

// Helper: Fetch all unsynced attendance records
export const getPendingRecords = async () => {
  try {
    return await db.pendingAttendance.where('synced').equals(0).toArray();
  } catch (err) {
    console.error('Failed to query local sync queue:', err);
    return [];
  }
};

// Helper: Mark records as successfully synchronized to Firestore
export const clearSynced = async (recordIds) => {
  try {
    await db.transaction('rw', db.pendingAttendance, async () => {
      for (const id of recordIds) {
        await db.pendingAttendance.delete(id);
      }
    });
    console.log(`Successfully cleared ${recordIds.length} synced local records.`);
  } catch (err) {
    console.error('Failed to delete synced records from queue:', err);
  }
};

export default db;
