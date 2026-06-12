/**
 * Layout Component - Main app shell
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

const pageConfig = {
  '/dashboard': { title: 'Dashboard', subtitle: 'School attendance overview' },
  '/attendance': { title: 'Attendance', subtitle: 'Mark and manage daily attendance' },
  '/students': { title: 'Students', subtitle: 'Student directory and profiles' },
  '/classes': { title: 'Classes', subtitle: 'Class-wise management' },
  '/reports': { title: 'Reports', subtitle: 'Generate and download reports' },
  '/meal-tracking': { title: 'Mid-Day Meals', subtitle: 'Meal planning and tracking' },
  '/face-register': { title: 'Face Registration', subtitle: 'Register student faces for recognition' },
  '/settings': { title: 'Settings', subtitle: 'System configuration' },
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const config = pageConfig[location.pathname] || { title: 'HND Attendance' };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header
        title={config.title}
        subtitle={config.subtitle}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
