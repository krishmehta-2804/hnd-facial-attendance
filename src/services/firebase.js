/**
 * Firebase Client SDK Initialization
 * Reads credentials from environment variables (see .env.example)
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object, populated from Vite environment variables or defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsHJ6DS0atgOyEc7tfory5Nbat0VR21NY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hnd-attendance.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hnd-attendance",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hnd-attendance.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "432436641018",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:432436641018:web:ceeb281ba51da2df489d43",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MCXL9XRY2S",
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
