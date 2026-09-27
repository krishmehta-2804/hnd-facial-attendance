/**
 * CloudSync Service - Firebase Firestore Synchronization
 * Enables real-time multi-device sharing for attendance, student roster,
 * face biometric vectors, meal logs, and users.
 */
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';
import { db as firestore } from './firebase';
import offlineDB from './offlineDB';

const COLLECTIONS = {
  STUDENTS: 'students',
  CLASSES: 'classes',
  TEACHERS: 'teachers',
  USERS: 'users',
  ATTENDANCE: 'attendance',
  FACE_DESCRIPTORS: 'faceDescriptors',
  MEAL_LOGS: 'mealLogs',
};

/**
 * Check if Cloud Firestore is available and accessible
 */
export const isCloudAvailable = async () => {
  try {
    // Quick test query with a small limit
    const q = query(collection(firestore, COLLECTIONS.CLASSES));
    await getDocs(q);
    return true;
  } catch (err) {
    console.warn('[CloudSync] Firestore currently unreachable or permission denied:', err.message);
    return false;
  }
};

/**
 * Seed initial school data to Cloud Firestore if collections are empty.
 */
export const seedCloudDatabaseIfEmpty = async (initialData = {}) => {
  try {
    const studentsSnap = await getDocs(collection(firestore, COLLECTIONS.STUDENTS));
    if (!studentsSnap.empty) {
      console.log('[CloudSync] Firestore already seeded with', studentsSnap.size, 'students.');
      return false;
    }

    console.log('[CloudSync] Cloud Firestore is empty. Initializing master school database in the cloud...');
    
    // 1. Seed Students in batches (Firestore batch limit is 500)
    if (initialData.students && initialData.students.length > 0) {
      const batch = writeBatch(firestore);
      initialData.students.forEach((s) => {
        const ref = doc(firestore, COLLECTIONS.STUDENTS, s.id);
        batch.set(ref, s);
      });
      await batch.commit();
      console.log(`[CloudSync] Seeded ${initialData.students.length} students to Firestore.`);
    }

    // 2. Seed Classes
    if (initialData.classes && initialData.classes.length > 0) {
      const batch = writeBatch(firestore);
      initialData.classes.forEach((c) => {
        const ref = doc(firestore, COLLECTIONS.CLASSES, c.id);
        batch.set(ref, c);
      });
      await batch.commit();
      console.log(`[CloudSync] Seeded ${initialData.classes.length} classes to Firestore.`);
    }

    // 3. Seed Teachers
    if (initialData.teachers && initialData.teachers.length > 0) {
      const batch = writeBatch(firestore);
      initialData.teachers.forEach((t) => {
        const ref = doc(firestore, COLLECTIONS.TEACHERS, t.id);
        batch.set(ref, t);
      });
      await batch.commit();
      console.log(`[CloudSync] Seeded ${initialData.teachers.length} teachers to Firestore.`);
    }

    // 4. Seed Users
    if (initialData.users && initialData.users.length > 0) {
      const batch = writeBatch(firestore);
      initialData.users.forEach((u) => {
        const ref = doc(firestore, COLLECTIONS.USERS, u.id);
        batch.set(ref, u);
      });
      await batch.commit();
      console.log(`[CloudSync] Seeded ${initialData.users.length} users to Firestore.`);
    }

    return true;
  } catch (err) {
    console.error('[CloudSync] Error during initial cloud seed:', err);
    return false;
  }
};

/**
 * Pull all data from Firestore to populate local IndexedDB on device launch.
 */
export const pullAllFromCloud = async () => {
  try {
    const results = {
      students: [],
      classes: [],
      teachers: [],
      users: [],
      attendance: [],
      faceDescriptors: [],
      mealLogs: {},
    };

    // 1. Fetch Students
    const studentsSnap = await getDocs(collection(firestore, COLLECTIONS.STUDENTS));
    studentsSnap.forEach((doc) => results.students.push(doc.data()));

    // 2. Fetch Classes
    const classesSnap = await getDocs(collection(firestore, COLLECTIONS.CLASSES));
    classesSnap.forEach((doc) => results.classes.push(doc.data()));

    // 3. Fetch Teachers
    const teachersSnap = await getDocs(collection(firestore, COLLECTIONS.TEACHERS));
    teachersSnap.forEach((doc) => results.teachers.push(doc.data()));

    // 4. Fetch Users
    const usersSnap = await getDocs(collection(firestore, COLLECTIONS.USERS));
    usersSnap.forEach((doc) => results.users.push(doc.data()));

    // 5. Fetch Face Descriptors
    const descriptorsSnap = await getDocs(collection(firestore, COLLECTIONS.FACE_DESCRIPTORS));
    descriptorsSnap.forEach((doc) => results.faceDescriptors.push(doc.data()));

    // 6. Fetch Attendance
    const attendanceSnap = await getDocs(collection(firestore, COLLECTIONS.ATTENDANCE));
    attendanceSnap.forEach((doc) => results.attendance.push(doc.data()));

    // 7. Fetch Meal Logs
    const mealLogsSnap = await getDocs(collection(firestore, COLLECTIONS.MEAL_LOGS));
    mealLogsSnap.forEach((doc) => {
      results.mealLogs[doc.id] = doc.data();
    });

    // Hydrate local Dexie IndexedDB
    if (results.students.length > 0) {
      await offlineDB.students.clear();
      await offlineDB.students.bulkAdd(results.students);
    }
    if (results.classes.length > 0) {
      await offlineDB.classes.clear();
      await offlineDB.classes.bulkAdd(results.classes);
    }
    if (results.teachers.length > 0) {
      await offlineDB.teachers.clear();
      await offlineDB.teachers.bulkAdd(results.teachers);
    }
    if (results.users.length > 0) {
      await offlineDB.users.clear();
      await offlineDB.users.bulkAdd(results.users);
    }
    if (results.faceDescriptors.length > 0) {
      await offlineDB.faceDescriptors.clear();
      await offlineDB.faceDescriptors.bulkAdd(results.faceDescriptors);
    }
    if (results.attendance.length > 0) {
      await offlineDB.attendance.clear();
      await offlineDB.attendance.bulkAdd(results.attendance);
    }
    if (Object.keys(results.mealLogs).length > 0) {
      localStorage.setItem('hnd_global_meal_logs', JSON.stringify(results.mealLogs));
    }

    console.log('[CloudSync] Successfully pulled and hydrated local database from Cloud Firestore.');
    return results;
  } catch (err) {
    console.error('[CloudSync] Failed to pull from Cloud Firestore:', err);
    return null;
  }
};

/**
 * Real-time listener for marked attendance (all dates or today)
 */
export const subscribeToAttendance = (date, onUpdate) => {
  try {
    const q = date 
      ? query(collection(firestore, COLLECTIONS.ATTENDANCE), where('date', '==', date))
      : query(collection(firestore, COLLECTIONS.ATTENDANCE));

    return onSnapshot(q, (snapshot) => {
      const records = [];
      snapshot.forEach((doc) => records.push(doc.data()));
      if (onUpdate) onUpdate(records);
    }, (err) => {
      console.warn('[CloudSync] Attendance subscription error:', err.message);
    });
  } catch (err) {
    console.warn('[CloudSync] Unable to set up attendance subscription:', err.message);
    return () => {};
  }
};

/**
 * Real-time listener for students changes
 */
export const subscribeToStudents = (onUpdate) => {
  try {
    return onSnapshot(collection(firestore, COLLECTIONS.STUDENTS), (snapshot) => {
      const students = [];
      snapshot.forEach((doc) => students.push(doc.data()));
      if (onUpdate) onUpdate(students);
    }, (err) => {
      console.warn('[CloudSync] Students subscription error:', err.message);
    });
  } catch (err) {
    console.warn('[CloudSync] Unable to set up students subscription:', err.message);
    return () => {};
  }
};

/**
 * Sync single Attendance Record to Firestore
 */
export const syncAttendanceRecord = async (record) => {
  try {
    const ref = doc(firestore, COLLECTIONS.ATTENDANCE, record.id);
    await setDoc(ref, record, { merge: true });
  } catch (err) {
    console.warn('[CloudSync] Failed to sync attendance to Firestore:', err.message);
  }
};

/**
 * Sync Face Descriptors (128-float array) to Firestore
 */
export const syncFaceDescriptor = async (studentId, descriptor) => {
  try {
    const ref = doc(firestore, COLLECTIONS.FACE_DESCRIPTORS, studentId);
    await setDoc(ref, {
      id: studentId,
      studentId,
      descriptor: Array.from(descriptor),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Also update student document's faceRegistered flag
    const studentRef = doc(firestore, COLLECTIONS.STUDENTS, studentId);
    await setDoc(studentRef, { faceRegistered: true }, { merge: true });

    console.log('[CloudSync] Biometric face template synced to cloud for student:', studentId);
  } catch (err) {
    console.warn('[CloudSync] Failed to sync face descriptor to Firestore:', err.message);
  }
};

/**
 * Delete Face Descriptor from Firestore
 */
export const deleteFaceDescriptorFromCloud = async (studentId) => {
  try {
    await deleteDoc(doc(firestore, COLLECTIONS.FACE_DESCRIPTORS, studentId));
  } catch (err) {
    console.warn('[CloudSync] Failed to delete face descriptor from cloud:', err.message);
  }
};

/**
 * Sync Student to Firestore
 */
export const syncStudent = async (student) => {
  try {
    const ref = doc(firestore, COLLECTIONS.STUDENTS, student.id);
    await setDoc(ref, student, { merge: true });
    console.log('[CloudSync] Student saved to cloud:', student.name);
  } catch (err) {
    console.warn('[CloudSync] Failed to save student to Firestore:', err.message);
  }
};

/**
 * Delete Student from Firestore
 */
export const deleteStudentFromCloud = async (studentId) => {
  try {
    await deleteDoc(doc(firestore, COLLECTIONS.STUDENTS, studentId));
    await deleteDoc(doc(firestore, COLLECTIONS.FACE_DESCRIPTORS, studentId));
    console.log('[CloudSync] Student deleted from cloud:', studentId);
  } catch (err) {
    console.warn('[CloudSync] Failed to delete student from Firestore:', err.message);
  }
};

/**
 * Sync Teacher to Firestore
 */
export const syncTeacher = async (teacher) => {
  try {
    const ref = doc(firestore, COLLECTIONS.TEACHERS, teacher.id);
    await setDoc(ref, teacher, { merge: true });
  } catch (err) {
    console.warn('[CloudSync] Failed to sync teacher to Firestore:', err.message);
  }
};

/**
 * Delete Teacher from Firestore
 */
export const deleteTeacherFromCloud = async (teacherId) => {
  try {
    await deleteDoc(doc(firestore, COLLECTIONS.TEACHERS, teacherId));
  } catch (err) {
    console.warn('[CloudSync] Failed to delete teacher from Firestore:', err.message);
  }
};

/**
 * Sync User Credentials to Firestore
 */
export const syncUser = async (user) => {
  try {
    const ref = doc(firestore, COLLECTIONS.USERS, user.id);
    await setDoc(ref, user, { merge: true });
  } catch (err) {
    console.warn('[CloudSync] Failed to sync user to Firestore:', err.message);
  }
};

/**
 * Delete User Credentials from Firestore
 */
export const deleteUserFromCloud = async (userId) => {
  try {
    await deleteDoc(doc(firestore, COLLECTIONS.USERS, userId));
  } catch (err) {
    console.warn('[CloudSync] Failed to delete user from Firestore:', err.message);
  }
};

/**
 * Sync Meal Log to Firestore
 */
export const syncMealLog = async (date, logData) => {
  try {
    const ref = doc(firestore, COLLECTIONS.MEAL_LOGS, date);
    await setDoc(ref, { ...logData, date }, { merge: true });
    console.log('[CloudSync] Meal log synced to cloud for:', date);
  } catch (err) {
    console.warn('[CloudSync] Failed to sync meal log to Firestore:', err.message);
  }
};

/**
 * Fetch all Meal Logs from Firestore
 */
export const fetchMealLogsFromCloud = async () => {
  try {
    const snap = await getDocs(collection(firestore, COLLECTIONS.MEAL_LOGS));
    const logs = {};
    snap.forEach((doc) => {
      logs[doc.id] = doc.data();
    });
    return logs;
  } catch (err) {
    console.warn('[CloudSync] Failed to fetch meal logs from Firestore:', err.message);
    return null;
  }
};
