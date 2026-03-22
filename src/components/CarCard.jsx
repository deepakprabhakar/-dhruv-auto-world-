import { Link } from 'react-router-dom';

export default function CarCard({ car, index = 0 }) {
  return (
    <Link
      to={`/car/${car.id}`}
      style={{ ...styles.card, animationDelay: `${index * 0.07}s` }}
      className="fade-up"
    >
      {/* Image */}
      <div style={styles.imageWrap}>
        <img src={car.exteriorImage} alt={car.name} style={styles.image} />
        <div style={styles.imageOverlay} />
        <span style={styles.categoryBadge}>{car.category}</span>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.name}>{car.name}</h3>
        <p style={styles.desc}>{car.description.slice(0, 85)}...</p>

        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Price</span>
            <span style={styles.metaValue}>{car.priceRange}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Mileage</span>
            <span style={styles.metaValue}>{car.mileage}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Fuel</span>
            <span style={styles.metaValue}>{car.fuelType}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.viewBtn}>View Details →</span>
          <span
            style={{
              ...styles.maintenanceDot,
              background:
                car.maintenanceLevel === 'Low'
                  ? '#4caf50'
                  : car.maintenanceLevel === 'Medium'
                  ? '#ff9800'
                  : '#e53935',
            }}
          />
          <span style={styles.maintenanceLabel}>{car.maintenanceLevel} Maintenance</span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'pointer',
    opacity: 0,
    animationFillMode: 'forwards',
    ':hover': {
      transform: 'translateY(-4px)',
    },
  },
  imageWrap: {
    position: 'relative',
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 60%)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(229,57,53,0.85)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    fontSize: 11,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
    letterSpacing: '1px',
    padding: '4px 10px',
    borderRadius: 20,
  },
  info: {
    padding: '18px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flex: 1,
  },
  name: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '0.5px',
  },
  desc: {
    fontSize: 13,
    color: '#7a7a7a',
    lineHeight: 1.55,
  },
  meta: {
    display: 'flex',
    gap: 16,
    paddingTop: 4,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    color: '#555',
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    color: '#c0c0c0',
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 14,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  viewBtn: {
    flex: 1,
    fontSize: 13,
    color: '#e53935',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  maintenanceDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
  },
  maintenanceLabel: {
    fontSize: 11,
    color: '#555',
  },
};
