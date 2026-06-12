/**
 * Header Component
 */
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';
import { getTodayDisplay } from '../../utils/dateUtils';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
} from 'lucide-react';

const Header = ({ title, subtitle, onMenuToggle }) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="header-title">{title || 'Dashboard'}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-search">
        <Search />
        <input
          type="text"
          placeholder="Search students, classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-right">
        <div className="header-date">
          <Calendar size={14} />
          {getTodayDisplay()}
        </div>

        <div className="header-notification">
          <button className="btn-icon" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <span className="notification-dot"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
