import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: '▦', desc: 'Analytics overview' },
  { to: '/problems',    label: 'Problems',     icon: '◈', desc: 'Problem list' },
  { to: '/submissions', label: 'Submissions',  icon: '◉', desc: 'My submissions' },
  { to: '/profile',     label: 'Profile',      icon: '◎', desc: 'Account settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⬡</span>
        <span className="logo-text">ErrorLens</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_LINKS.map(({ to, label, icon, desc }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${location.pathname.startsWith(to) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <div className="sidebar-link-text">
              <span className="sidebar-label">{label}</span>
              <span className="sidebar-desc">{desc}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user?.username}</span>
            <span className="sidebar-email">{user?.email}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>⬡ Logout</button>
      </div>
    </aside>
  );
}
