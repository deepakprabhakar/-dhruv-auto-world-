import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>DHRUV AUTO WORLD</span>
        </Link>

        {/* Nav Links */}
        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>
            Showroom
          </Link>
          <Link
            to="/chat"
            style={{ ...styles.link, ...(isActive('/chat') ? styles.linkActive : {}) }}
          >
            AI Advisor
          </Link>
        </div>

        {/* User */}
        {user && (
          <div style={styles.userArea}>
            <img
              src={user.photoURL || 'https://via.placeholder.com/32'}
              alt={user.displayName}
              style={styles.avatar}
            />
            <span style={styles.userName}>{user.displayName?.split(' ')[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(8, 8, 8, 0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: 22,
    color: '#e53935',
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '2px',
  },
  links: {
    display: 'flex',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '1px',
    color: '#777',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: 6,
    transition: 'all 0.2s',
  },
  linkActive: {
    color: '#f0f0f0',
    background: 'rgba(255,255,255,0.06)',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '2px solid #e53935',
    objectFit: 'cover',
  },
  userName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: '#9e9e9e',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    color: '#666',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    padding: '5px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
