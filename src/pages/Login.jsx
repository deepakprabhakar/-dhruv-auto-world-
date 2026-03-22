import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background gradient */}
      <div style={styles.bgGradient} />
      <div style={styles.bgGrid} />

      <div style={styles.card} className="fade-up">
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoHex}>⬡</div>
          <h1 style={styles.brand}>DHRUV AUTO WORLD</h1>
          <p style={styles.tagline}>Find the Right Car. Not Just Any Car.</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Sign In */}
        <div style={styles.signInArea}>
          <p style={styles.signInLabel}>Access your AI Car Advisor</p>
          <button onClick={handleLogin} style={styles.googleBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p style={styles.footer}>
          Your chat history is securely saved with your account.
        </p>
      </div>

      {/* Car silhouette decoration */}
      <div style={styles.carDecoration}>
        <svg viewBox="0 0 800 300" style={{ width: '100%', opacity: 0.04 }}>
          <path
            d="M50,200 L100,200 L130,140 L200,120 L350,110 L500,120 L580,140 L650,160 L700,200 L750,200"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="180" cy="210" r="40" fill="none" stroke="white" strokeWidth="8" />
          <circle cx="580" cy="210" r="40" fill="none" stroke="white" strokeWidth="8" />
        </svg>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080808',
    position: 'relative',
    overflow: 'hidden',
    padding: 24,
  },
  bgGradient: {
    position: 'absolute',
    top: '-20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80vw',
    height: '60vh',
    background: 'radial-gradient(ellipse at center, rgba(229,57,53,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 420,
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    opacity: 0,
    animationFillMode: 'forwards',
  },
  logoArea: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  logoHex: {
    fontSize: 40,
    color: '#e53935',
    lineHeight: 1,
    filter: 'drop-shadow(0 0 20px rgba(229,57,53,0.5))',
  },
  brand: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '3px',
  },
  tagline: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
  },
  signInArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  signInLabel: {
    fontSize: 13,
    color: '#666',
    letterSpacing: '0.5px',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 28px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#e0e0e0',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#3a3a3a',
  },
  carDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
};
