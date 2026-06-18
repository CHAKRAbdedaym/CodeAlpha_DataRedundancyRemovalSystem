import React from 'react';

const colorStyles = {
  cyan:   { icon: 'rgba(0,212,255,0.12)',  text: '#00d4ff', glow: '0 0 20px rgba(0,212,255,0.2)' },
  green:  { icon: 'rgba(0,255,136,0.12)',  text: '#00ff88', glow: '0 0 20px rgba(0,255,136,0.2)' },
  red:    { icon: 'rgba(255,71,87,0.12)',  text: '#ff4757', glow: '0 0 20px rgba(255,71,87,0.2)' },
  amber:  { icon: 'rgba(255,165,2,0.12)', text: '#ffa502', glow: '0 0 20px rgba(255,165,2,0.2)' },
  purple: { icon: 'rgba(155,89,182,0.12)',text: '#9b59b6', glow: '0 0 20px rgba(155,89,182,0.2)' },
};

const StatsCard = ({ title, value, icon: Icon, color = 'cyan', subtitle }) => {
  const cs = colorStyles[color] || colorStyles.cyan;
  return (
    <div className="ai-card fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          width: '48px', height: '48px',
          background: cs.icon,
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: cs.glow,
        }}>
          <Icon size={22} color={cs.text} />
        </div>
        <span className="badge badge-cyan" style={{ color: cs.text, borderColor: `${cs.text}33`, background: cs.icon }}>Live</span>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '8px' }}>{title}</p>
        <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {subtitle && <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
