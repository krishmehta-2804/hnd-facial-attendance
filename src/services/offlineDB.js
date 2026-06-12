/**
 * Offline DB Service - Local storage with Dexie.js IndexedDB
 */
import Dexie from 'dexie';

// Initialize Dexie Database
export const db = new Dexie('HNDAttendanceDB');

// Define schema structures:
// version 1: students, faceDescriptors, pendingAttendance, cachedData
db.version(1).stores({
  students: 'id, name, rollNo, classId, className, faceRegistered',
  faceDescriptors: 'id, studentId, descriptor',
  pendingAttendance: 'id, studentId, studentName, status, date, timestamp, synced',
  cachedData: 'key, value, updatedAt',
});

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
