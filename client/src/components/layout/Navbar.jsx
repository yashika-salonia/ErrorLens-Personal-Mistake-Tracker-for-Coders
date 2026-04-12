import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: '▦' },
  { to: '/problems',    label: 'Problems',     icon: '◈' },
  { to: '/submissions', label: 'Submissions',  icon: '◉' },
  { to: '/profile',     label: 'Profile',      icon: '◎' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Backend uses `name` not `username`
  const displayName = user?.name || user?.username || 'User';
  const avatarLetter = displayName[0]?.toUpperCase() || 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">ErrorLens</span>
        </Link>

        <div className="navbar-links">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`nav-link ${location.pathname.startsWith(to) ? 'active' : ''}`}>
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div className="user-pill" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="user-avatar">{avatarLetter}</div>
            <span className="user-name">{displayName}</span>
            <span className="chevron">{menuOpen ? '▴' : '▾'}</span>
          </div>
          {menuOpen && (
            <div className="user-dropdown">
              <Link to="/profile" className="dropdown-item"
                onClick={() => setMenuOpen(false)}>◎ Profile</Link>
              <button className="dropdown-item danger" onClick={handleLogout}>
                ⬡ Logout
              </button>
            </div>
          )}
        </div>

        <button className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}>
              {icon} {label}
            </Link>
          ))}
          <button className="mobile-nav-link danger"
            onClick={handleLogout}>⬡ Logout</button>
        </div>
      )}
    </nav>
  );
}