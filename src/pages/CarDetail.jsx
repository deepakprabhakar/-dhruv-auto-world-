import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCarById } from '../data/cars';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = getCarById(id);

  if (!car) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.notFound}>
          <p style={{ color: '#555', fontFamily: "'Rajdhani', sans-serif", fontSize: 22 }}>
            Car not found
          </p>
          <Link to="/" style={{ color: '#e53935', fontSize: 14, textDecoration: 'none' }}>
            ← Back to Showroom
          </Link>
        </div>
      </div>
    );
  }

  const handleAskAI = () => {
    navigate('/chat', { state: { carName: car.name } });
  };

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero */}
      <div style={styles.heroWrap}>
        <img src={car.exteriorImage} alt={car.name} style={styles.heroImage} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <Link to={`/category/${car.category.toLowerCase()}`} style={styles.backLink}>
            ← {car.category}
          </Link>
          <h1 style={styles.heroTitle}>{car.name}</h1>
          <div style={styles.heroBadges}>
            <span style={styles.badge}>{car.fuelType}</span>
            <span style={styles.badge}>{car.mileage}</span>
            <span style={{ ...styles.badge, background: 'rgba(229,57,53,0.2)', color: '#e53935', border: '1px solid rgba(229,57,53,0.3)' }}>
              {car.priceRange}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={styles.content}>
        {/* Description + AI Button */}
        <div style={styles.topRow}>
          <div style={styles.descBox}>
            <p style={styles.description}>{car.description}</p>
          </div>
          <button onClick={handleAskAI} style={styles.aiBtn}>
            <span style={styles.aiIcon}>🤖</span>
            <div>
              <div style={styles.aiBtnTitle}>Ask AI About This Car</div>
              <div style={styles.aiBtnSub}>Get personalized advice</div>
            </div>
            <span style={{ color: '#e53935', fontSize: 20 }}>→</span>
          </button>
        </div>

        {/* Specs + Interior */}
        <div style={styles.twoCol}>
          {/* Specs */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>SPECIFICATIONS</h2>
            <div style={styles.specsList}>
              {Object.entries(car.specs).map(([key, value]) => (
                <div key={key} style={styles.specRow}>
                  <span style={styles.specKey}>
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <span style={styles.specValue}>{value}</span>
                </div>
              ))}
              <div style={styles.specRow}>
                <span style={styles.specKey}>Maintenance</span>
                <span
                  style={{
                    ...styles.specValue,
                    color:
                      car.maintenanceLevel === 'Low'
                        ? '#4caf50'
                        : car.maintenanceLevel === 'Medium'
                        ? '#ff9800'
                        : '#e53935',
                  }}
                >
                  {car.maintenanceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Interior */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>INTERIOR</h2>
            <div style={styles.interiorWrap}>
              <img src={car.interiorImage} alt={`${car.name} interior`} style={styles.interiorImg} />
              <div style={styles.interiorLabels}>
                {[
                  { label: 'Seating', value: 'Comfortable fabric/leather seats' },
                  { label: 'Dashboard', value: 'Driver-focused ergonomic layout' },
                  { label: 'Infotainment', value: 'Modern touchscreen system' },
                ].map((item) => (
                  <div key={item.label} style={styles.interiorLabel}>
                    <span style={styles.labelDot} />
                    <div>
                      <div style={styles.labelTitle}>{item.label}</div>
                      <div style={styles.labelDesc}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div style={styles.prosConsRow}>
          <div style={styles.prosCard}>
            <h2 style={styles.cardTitle} className="pros">✓ PROS</h2>
            <ul style={styles.list}>
              {car.pros.map((pro, i) => (
                <li key={i} style={styles.proItem}>
                  <span style={styles.proCheck}>✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.consCard}>
            <h2 style={styles.cardTitle}>✗ CONS</h2>
            <ul style={styles.list}>
              {car.cons.map((con, i) => (
                <li key={i} style={styles.conItem}>
                  <span style={styles.conX}>✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom AI CTA */}
        <div style={styles.bottomCta}>
          <span style={styles.bottomCtaText}>
            Thinking about buying a <strong style={{ color: '#e53935' }}>{car.name}</strong>?
          </span>
          <button onClick={handleAskAI} style={styles.bottomCtaBtn}>
            Get AI Recommendation →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808', paddingBottom: 80 },
  notFound: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '60vh', gap: 16,
  },

  heroWrap: {
    position: 'relative',
    height: 480,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%', height: '100%', objectFit: 'cover',
    filter: 'brightness(0.5)',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.4) 60%, transparent 100%)',
  },
  heroContent: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '48px',
    maxWidth: 1280, margin: '0 auto',
    gap: 12,
  },
  backLink: {
    fontSize: 13, color: '#666', textDecoration: 'none',
    fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 52, fontWeight: 700,
    color: '#f0f0f0', letterSpacing: '-0.5px',
    lineHeight: 1,
  },
  heroBadges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: {
    padding: '5px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 20, fontSize: 12, color: '#aaa',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
    letterSpacing: '0.5px',
  },

  content: { paddingTop: 40 },

  topRow: {
    display: 'flex', gap: 20, marginBottom: 24,
    alignItems: 'flex-start',
  },
  descBox: {
    flex: 1,
    padding: '24px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  description: { fontSize: 15, color: '#777', lineHeight: 1.75 },
  aiBtn: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '20px 24px',
    background: 'rgba(229,57,53,0.07)',
    border: '1px solid rgba(229,57,53,0.25)',
    borderRadius: 12, cursor: 'pointer',
    transition: 'all 0.2s', minWidth: 280,
  },
  aiIcon: { fontSize: 28 },
  aiBtnTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 16, fontWeight: 700, color: '#f0f0f0',
    letterSpacing: '0.5px',
  },
  aiBtnSub: { fontSize: 12, color: '#555', marginTop: 3 },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  card: {
    padding: '28px', background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
  },
  cardTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 13, fontWeight: 700, color: '#444',
    letterSpacing: '3px', marginBottom: 20,
  },

  specsList: { display: 'flex', flexDirection: 'column', gap: 0 },
  specRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  specKey: { fontSize: 13, color: '#555' },
  specValue: { fontSize: 13, color: '#c0c0c0', fontWeight: 500, textAlign: 'right' },

  interiorWrap: { display: 'flex', flexDirection: 'column', gap: 16 },
  interiorImg: {
    width: '100%', height: 160, objectFit: 'cover',
    borderRadius: 10, opacity: 0.85,
  },
  interiorLabels: { display: 'flex', flexDirection: 'column', gap: 12 },
  interiorLabel: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  labelDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#e53935', marginTop: 6, flexShrink: 0,
  },
  labelTitle: { fontSize: 13, color: '#aaa', fontWeight: 500 },
  labelDesc: { fontSize: 12, color: '#555', marginTop: 2 },

  prosConsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
  prosCard: {
    padding: '28px', background: 'rgba(76,175,80,0.04)',
    border: '1px solid rgba(76,175,80,0.12)', borderRadius: 14,
  },
  consCard: {
    padding: '28px', background: 'rgba(229,57,53,0.04)',
    border: '1px solid rgba(229,57,53,0.12)', borderRadius: 14,
  },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  proItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    fontSize: 14, color: '#ccc', lineHeight: 1.5,
  },
  conItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    fontSize: 14, color: '#ccc', lineHeight: 1.5,
  },
  proCheck: { color: '#4caf50', fontWeight: 700, flexShrink: 0, marginTop: 1 },
  conX: { color: '#e53935', fontWeight: 700, flexShrink: 0, marginTop: 1 },

  bottomCta: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 32px',
    background: 'rgba(229,57,53,0.05)',
    border: '1px solid rgba(229,57,53,0.15)',
    borderRadius: 12,
  },
  bottomCtaText: { fontSize: 16, color: '#666' },
  bottomCtaBtn: {
    background: '#e53935', color: 'white',
    padding: '12px 24px', borderRadius: 8,
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15, fontWeight: 700, letterSpacing: '0.5px',
    border: 'none', cursor: 'pointer',
  },
};
