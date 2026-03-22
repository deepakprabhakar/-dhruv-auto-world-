import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CarCard from '../components/CarCard';
import { getCarsByCategory, categories } from '../data/cars';

export default function Category() {
  const { slug } = useParams();
  const filteredCars = getCarsByCategory(slug);
  const categoryInfo = categories.find((c) => c.slug === slug);

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div className="page-container">
          <Link to="/" style={styles.breadcrumb}>← Back to Showroom</Link>
          <div style={styles.headerContent} className="fade-up">
            <span style={styles.catIcon}>{categoryInfo?.icon || '🚗'}</span>
            <div>
              <h1 style={styles.title}>{categoryInfo?.label || slug.toUpperCase()} CARS</h1>
              <p style={styles.subtitle}>{categoryInfo?.desc || 'Browse our collection'}</p>
            </div>
          </div>
          <div style={styles.countBadge}>{filteredCars.length} cars available</div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={styles.pillsBar}>
        <div className="page-container" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              style={{
                ...styles.pill,
                ...(cat.slug === slug ? styles.pillActive : {}),
              }}
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="page-container" style={styles.content}>
        {filteredCars.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>No cars in this category yet</p>
            <Link to="/" style={styles.emptyLink}>← Back to all cars</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredCars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}

        {/* AI CTA */}
        <div style={styles.aiCta}>
          <span style={styles.aiCtaText}>
            💬 Not sure which {categoryInfo?.label || 'car'} is right for you?
          </span>
          <Link to="/chat" style={styles.aiCtaBtn}>Ask AI →</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808', paddingBottom: 80 },
  header: {
    padding: '40px 0 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  breadcrumb: {
    fontSize: 13,
    color: '#444',
    textDecoration: 'none',
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: 20,
    transition: 'color 0.2s',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    opacity: 0,
    animationFillMode: 'forwards',
  },
  catIcon: { fontSize: 48 },
  title: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '2px',
  },
  subtitle: { fontSize: 14, color: '#555', marginTop: 4 },
  countBadge: {
    marginTop: 16,
    fontSize: 12,
    color: '#444',
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  pillsBar: {
    padding: '16px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  pill: {
    padding: '7px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.5px',
    textDecoration: 'none',
    color: '#555',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  pillActive: {
    color: '#e53935',
    background: 'rgba(229,57,53,0.1)',
    border: '1px solid rgba(229,57,53,0.3)',
  },
  content: { paddingTop: 48 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 22,
    color: '#444',
    fontWeight: 600,
  },
  emptyLink: {
    color: '#e53935',
    textDecoration: 'none',
    fontSize: 14,
  },
  aiCta: {
    marginTop: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 28px',
    background: 'rgba(229,57,53,0.05)',
    border: '1px solid rgba(229,57,53,0.15)',
    borderRadius: 12,
  },
  aiCtaText: { fontSize: 15, color: '#666' },
  aiCtaBtn: {
    background: '#e53935',
    color: 'white',
    padding: '10px 22px',
    borderRadius: 7,
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textDecoration: 'none',
  },
};
