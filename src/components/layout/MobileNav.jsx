/**
 * Mobile Bottom Navigation
 */
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, Users, FileText, MoreHorizontal } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();

  const items = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/attendance', label: 'Attendance', icon: Camera },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="mobile-nav no-print">
      <div className="mobile-nav-items">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
