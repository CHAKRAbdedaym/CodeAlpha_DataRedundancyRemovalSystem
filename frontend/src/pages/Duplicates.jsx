import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldX, Ghost, Mail, Phone } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Duplicates = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/duplicates`).then(r => setDuplicates(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <ShieldX size={22} color="#ff4757" />
            <h2 style={{ fontSize: '26px', fontWeight: 800, background: 'linear-gradient(135deg,#ff4757,#ffa502)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Duplicate Report</h2>
          </div>
          <p style={{ color: '#475569', fontSize: '14px' }}>AI-detected redundant records blocked from the database</p>
        </div>
        <div style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#ff4757" />
          <span style={{ color: '#ff4757', fontWeight: 700, fontSize: '14px' }}>{duplicates.length} Entries Blocked</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="ai-card" style={{ height: '180px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))
        ) : duplicates.length > 0 ? (
          duplicates.map((dup, i) => (
            <div key={dup.id || i} className="ai-card fade-in" style={{ padding: '20px', animationDelay: `${i * 30}ms` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,71,87,0.1)', borderRadius: '10px', boxShadow: '0 0 15px rgba(255,71,87,0.15)' }}>
                  <AlertTriangle size={18} color="#ff4757" />
                </div>
                <span className="badge badge-red">{dup.reason || 'Duplicate'}</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dup.name || 'Unknown'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={13} color="#475569" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dup.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={13} color="#475569" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{dup.phone}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ai-card" style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center' }}>
            <Ghost size={56} color="#1e293b" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#475569', fontSize: '18px', fontWeight: 600 }}>No duplicates found.</p>
            <p style={{ color: '#334155', fontSize: '14px', marginTop: '8px' }}>Your database is clean. The AI has spoken.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Duplicates;
