import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CarCard from '../components/CarCard';
import { cars, categories } from '../data/cars';

export default function Home() {
  const featuredCars = cars.slice(0, 6);

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroGrid} />
        <div style={styles.heroContent} className="fade-up">
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            AI-Powered Used Car Advisor
          </div>
          <h1 style={styles.heroTitle}>
            DHRUV AUTO
            <br />
            <span style={styles.heroTitleAccent}>WORLD</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Find the Right Car. Not Just Any Car.
          </p>
          <p style={styles.heroDesc}>
            Get personalized AI advice on the best second-hand cars for your budget,
            lifestyle, and city. No fluff. Just honest recommendations.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/chat" className="btn btn-primary" style={styles.ctaPrimary}>
              Ask AI Advisor →
            </Link>
            <Link to="/category/suv" className="btn btn-ghost" style={styles.ctaGhost}>
              Browse Cars
            </Link>
          </div>
        </div>

        {/* Hero car image */}
        <div style={styles.heroImageWrap}>
          <div style={styles.heroImageGlow} />
          <img
            src="https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=1000&q=80"
            alt="Premium Car"
            style={styles.heroImage}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        {[
          { value: '10+', label: 'Cars Reviewed' },
          { value: '5', label: 'Categories' },
          { value: 'AI', label: 'Powered Advice' },
          { value: '₹3L', label: 'Starting Budget' },
        ].map((stat) => (
          <div key={stat.label} style={styles.statItem}>
            <span style={styles.statValue}>{stat.value}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section style={styles.section}>
        <div className="page-container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>BROWSE BY CATEGORY</h2>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.categoryGrid}>
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{ ...styles.categoryCard, animationDelay: `${i * 0.06}s` }}
                className="fade-up"
              >
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={styles.catLabel}>{cat.label}</span>
                <span style={styles.catDesc}>{cat.desc}</span>
                <span style={styles.catArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section style={styles.section}>
        <div className="page-container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>FEATURED CARS</h2>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.carsGrid}>
            {featuredCars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <div className="page-container">
          <div style={styles.ctaBannerInner}>
            <div style={styles.ctaBannerGlow} />
            <h2 style={styles.ctaBannerTitle}>Not Sure Which Car?</h2>
            <p style={styles.ctaBannerDesc}>
              Tell our AI your budget, usage, and preference — get a personalized recommendation in seconds.
            </p>
            <Link to="/chat" style={styles.ctaBannerBtn}>
              Start AI Chat →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>
          ⬡ DHRUV AUTO WORLD — AI-Powered Car Advisor for India
        </span>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808' },

  hero: {
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '80px 24px',
    maxWidth: 1280,
    margin: '0 auto',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(229,57,53,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
    `,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    flex: '0 0 520px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    opacity: 0,
    animationFillMode: 'forwards',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(229,57,53,0.1)',
    border: '1px solid rgba(229,57,53,0.3)',
    borderRadius: 20,
    padding: '5px 14px',
    fontSize: 12,
    color: '#e53935',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '1px',
    width: 'fit-content',
  },
  heroBadgeDot: {
    width: 6, height: 6,
    borderRadius: '50%',
    background: '#e53935',
    animation: 'pulse 2s infinite',
  },
  heroTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 'clamp(52px, 7vw, 88px)',
    fontWeight: 700,
    lineHeight: 0.95,
    color: '#f0f0f0',
    letterSpacing: '-1px',
  },
  heroTitleAccent: {
    color: '#e53935',
    textShadow: '0 0 60px rgba(229,57,53,0.4)',
  },
  heroSubtitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 20,
    color: '#777',
    fontWeight: 500,
    letterSpacing: '1px',
  },
  heroDesc: {
    fontSize: 15,
    color: '#555',
    lineHeight: 1.7,
    maxWidth: 440,
  },
  heroCtas: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  ctaPrimary: {
    background: '#e53935',
    color: 'white',
    padding: '14px 28px',
    borderRadius: 8,
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  ctaGhost: {
    background: 'transparent',
    color: '#666',
    padding: '14px 28px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  heroImageWrap: {
    position: 'absolute',
    right: '-5%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '55%',
    zIndex: 1,
  },
  heroImageGlow: {
    position: 'absolute',
    inset: '-10%',
    background: 'radial-gradient(ellipse at center, rgba(229,57,53,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 20,
    opacity: 0.75,
    filter: 'contrast(1.05) saturate(0.9)',
    maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
  },

  statsBar: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    gap: 0,
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.01)',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    gap: 3,
  },
  statValue: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#e53935',
  },
  statLabel: {
    fontSize: 11,
    color: '#444',
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },

  section: {
    padding: '80px 0',
  },
  sectionHeader: {
    marginBottom: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  sectionTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '3px',
    color: '#444',
    whiteSpace: 'nowrap',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 12,
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '20px 18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    opacity: 0,
    animationFillMode: 'forwards',
    position: 'relative',
    overflow: 'hidden',
  },
  catIcon: { fontSize: 28 },
  catLabel: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#d0d0d0',
    letterSpacing: '0.5px',
  },
  catDesc: {
    fontSize: 11,
    color: '#444',
    lineHeight: 1.4,
  },
  catArrow: {
    marginTop: 8,
    fontSize: 16,
    color: '#e53935',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
  },

  carsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
  },

  ctaBanner: {
    padding: '60px 0 80px',
  },
  ctaBannerInner: {
    position: 'relative',
    background: 'rgba(229,57,53,0.06)',
    border: '1px solid rgba(229,57,53,0.2)',
    borderRadius: 20,
    padding: '56px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
  ctaBannerGlow: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%', height: '200%',
    background: 'radial-gradient(ellipse at center, rgba(229,57,53,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaBannerTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#f0f0f0',
    position: 'relative',
    zIndex: 1,
  },
  ctaBannerDesc: {
    fontSize: 15,
    color: '#666',
    maxWidth: 500,
    lineHeight: 1.7,
    position: 'relative',
    zIndex: 1,
  },
  ctaBannerBtn: {
    background: '#e53935',
    color: 'white',
    padding: '14px 32px',
    borderRadius: 8,
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
    zIndex: 1,
  },

  footer: {
    padding: '24px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  footerText: {
    fontSize: 12,
    color: '#2a2a2a',
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '1.5px',
  },
};
