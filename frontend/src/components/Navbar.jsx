import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Upload, Users, History, AlertCircle, Cpu } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: BarChart3 },
  { name: 'Upload CSV', path: '/upload', icon: Upload },
  { name: 'Records', path: '/records', icon: Users },
  { name: 'History', path: '/history', icon: History },
  { name: 'Duplicates', path: '/duplicates', icon: AlertCircle },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: '260px',
      background: 'rgba(5, 8, 16, 0.95)',
      borderRight: '1px solid rgba(0, 212, 255, 0.12)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', padding: '28px 16px',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', padding: '0 8px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
        }}>
          <Cpu size={20} color="#050810" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0', lineHeight: 1.2 }}>DataGuard AI</div>
          <div style={{ fontSize: '10px', color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>CodeAlpha · Cloud</div>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: '20px', background: 'rgba(0,255,136,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.1)' }}>
        <div className="pulse-dot" />
        <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 600, letterSpacing: '0.05em' }}>SYSTEM ONLINE</span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} className={`nav-link ${active ? 'active' : ''}`}>
              <Icon size={18} style={{ opacity: active ? 1 : 0.6 }} />
              {name}
              {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }} />}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px', borderRadius: '12px',
        background: 'rgba(0, 212, 255, 0.04)',
        border: '1px solid rgba(0, 212, 255, 0.1)',
        marginTop: '16px',
      }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: '#00d4ff', marginBottom: '4px' }}>Task 1 · Redundancy Removal</div>
          <div style={{ opacity: 0.7, fontSize: '10px' }}>Internship · Cloud Computing</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
