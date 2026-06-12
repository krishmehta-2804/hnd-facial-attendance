/**
 * HND Facial Attendance System - Auth Context
 * Manages authentication state and role-based access
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { demoUsers } from '../services/demoData';
import { STORAGE_KEYS, ROLE_PERMISSIONS } from '../utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Demo authentication
    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      avatar: user.avatar,
      assignedClasses: user.assignedClasses,
      childIds: user.childIds,
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
    hasPermission,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
