/**
 * HND Facial Attendance System - Auth Context
 * Manages authentication state and role-based access against IndexedDB database
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { demoUsers } from '../services/demoData';
import { STORAGE_KEYS, ROLE_PERMISSIONS } from '../utils/constants';
import db from '../services/offlineDB';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize users in IndexedDB if empty
  const initializeUsersDB = useCallback(async () => {
    try {
      const count = await db.users.count();
      if (count === 0) {
        // Exclude parent accounts from the static users table to keep it clean (parents are generated dynamically)
        const staticUsers = demoUsers.filter(u => u.role !== 'parent');
        await db.users.bulkAdd(staticUsers);
        console.log('Successfully initialized users database in IndexedDB');
      } else {
        // Dynamic headmaster credentials updates
        await db.users.delete('headmaster-seema');
        
        // Force-update Priya Ma'am credentials to match school_data.json
        await db.users.put({
          id: 'headmaster-priya',
          name: 'Ms. Priya',
          email: 'priya@hnd.edu',
          password: 'headmaster123',
          role: 'headmaster',
          schoolId: 'school-001',
          phone: '+91-98765-77777',
          avatar: 'PR'
        });

        // Force-update Shivendra Sir credentials to match school_data.json
        await db.users.put({
          id: 'headmaster-shivendra',
          name: 'Mr. Shivendra',
          email: 'shivendra@hnd.edu',
          password: 'headmaster123',
          role: 'headmaster',
          schoolId: 'school-001',
          phone: '+91-98765-66666',
          avatar: 'SH'
        });
      }
    } catch (e) {
      console.error('Failed to initialize users in IndexedDB:', e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeUsersDB();
      // Restore session
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      }
      setLoading(false);
    };
    init();
  }, [initializeUsersDB]);

  const login = useCallback(async (username, password) => {
    let cleanUsername = username.trim().toLowerCase();
    
    // Automatically map 10-digit phone number or admission number to parent email format
    if (!cleanUsername.includes('@')) {
      if (/^\d{10}$/.test(cleanUsername)) {
        cleanUsername = `${cleanUsername}@hnd.edu`;
      } else if (cleanUsername.startsWith('cscbv')) {
        cleanUsername = `parent_${cleanUsername}@hnd.edu`;
      }
    }

    // Query local IndexedDB for users (teachers, admin, headmaster)
    const localUsers = await db.users.toArray();
    let user = localUsers.find(
      (u) => u.email.toLowerCase() === cleanUsername && u.password === password
    );

    // If not found, check if it matches a parent dynamically generated from the students database
    if (!user) {
      const students = await db.students.toArray();
      const parentPhone = cleanUsername.split('@')[0].replace('parent_', '');
      
      // Find student by parent phone or admission number
      const student = students.find(
        (s) => s.parentPhone === parentPhone || s.admissionNo.toLowerCase() === parentPhone
      );

      if (student && password === 'parent123') {
        user = {
          id: `parent-phone-${student.parentPhone}`,
          name: `Parent of ${student.name}`,
          email: `${student.parentPhone}@hnd.edu`,
          password: 'parent123',
          role: 'parent',
          schoolId: 'school-001',
          childIds: [student.id],
          phone: student.parentPhone,
          avatar: 'P',
        };
      }
    }

    if (!user) {
      throw new Error('Invalid username, phone number, or password');
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      avatar: user.avatar,
      assignedClasses: user.assignedClasses || [],
      childIds: user.childIds || [],
      phone: user.phone,
    };

    setCurrentUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }, []);

  // Expose a method to change users' passwords directly from the admin panel
  const updatePassword = useCallback(async (userId, newPassword) => {
    try {
      await db.users.update(userId, { password: newPassword });
      console.log(`Password updated successfully for user ${userId}`);
    } catch (e) {
      console.error('Failed to update password in IndexedDB:', e);
      throw e;
    }
  }, []);

  const hasPermission = useCallback(
    (permission) => {
      if (!currentUser) return false;
      return ROLE_PERMISSIONS[currentUser.role]?.includes(permission) ?? false;
    },
    [currentUser]
  );

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updatePassword,
    hasPermission,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
