/**
 * Sidebar Navigation Component
 */
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES, ROUTES, ROLE_LABELS } from '../../utils/constants';
import {
  LayoutDashboard,
  Camera,
  Users,
  School,
  FileText,
  UtensilsCrossed,
  Settings,
  LogOut,
  ScanFace,
  BarChart3,
  Bell,
  GraduationCap,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navItems = {
    main: [
      { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.TEACHER, USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
      { path: ROUTES.ATTENDANCE, label: 'Attendance', icon: Camera, roles: [USER_ROLES.TEACHER, USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
      { path: ROUTES.STUDENTS, label: 'Students', icon: Users, roles: [USER_ROLES.TEACHER, USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
      { path: ROUTES.CLASSES, label: 'Classes', icon: School, roles: [USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
    ],
    analytics: [
      { path: ROUTES.REPORTS, label: 'Reports', icon: FileText, roles: [USER_ROLES.TEACHER, USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
      { path: ROUTES.MEAL_TRACKING, label: 'Mid-Day Meals', icon: UtensilsCrossed, roles: [USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
    ],
    system: [
      { path: ROUTES.FACE_REGISTER, label: 'Face Register', icon: ScanFace, roles: [USER_ROLES.TEACHER, USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
      { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings, roles: [USER_ROLES.HEADMASTER, USER_ROLES.ADMIN] },
    ],
    parent: [
      { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.PARENT] },
    ],
  };

  const filterByRole = (items) =>
    items.filter((item) => item.roles.includes(currentUser?.role));

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap />
          </div>
          <div className="sidebar-brand">
            <h2>HND Attendance</h2>
            <span>Facial Recognition System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {currentUser?.role === USER_ROLES.PARENT ? (
            <>
              <div className="sidebar-section-label">Menu</div>
              {filterByRole(navItems.parent).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          ) : (
            <>
              <div className="sidebar-section-label">Main</div>
              {filterByRole(navItems.main).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="sidebar-section-label">Analytics</div>
              {filterByRole(navItems.analytics).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="sidebar-section-label">System</div>
              {filterByRole(navItems.system).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {currentUser?.avatar || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser?.name || 'User'}</div>
              <div className="sidebar-user-role">
                {ROLE_LABELS[currentUser?.role] || 'Unknown'}
              </div>
            </div>
          </div>
          <button className="nav-item" onClick={logout} style={{ marginTop: '8px', color: 'var(--danger-light)' }}>
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
