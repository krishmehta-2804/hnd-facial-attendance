/**
 * HND Facial Attendance System - Main App Component
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';
import ClassesPage from './pages/ClassesPage';
import ReportsPage from './pages/ReportsPage';
import MealPlanningPage from './pages/MealPlanningPage';
import FaceRegisterPage from './pages/FaceRegisterPage';
import SettingsPage from './pages/SettingsPage';
import { ROUTES } from './utils/constants';

// Route Guard for authenticated pages
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            
            {/* Protected App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
              <Route path={ROUTES.STUDENTS} element={<StudentsPage />} />
              <Route path={ROUTES.CLASSES} element={<ClassesPage />} />
              <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
              <Route path={ROUTES.MEAL_TRACKING} element={<MealPlanningPage />} />
              <Route path={ROUTES.FACE_REGISTER} element={<FaceRegisterPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
