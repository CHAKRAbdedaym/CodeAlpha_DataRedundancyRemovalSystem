import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, FileText, Calendar, Check, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/upload-history`).then(r => setHistory(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <HistoryIcon size={22} color="#00d4ff" />
          <h2 className="text-gradient" style={{ fontSize: '26px', fontWeight: 800 }}>Upload History</h2>
        </div>
        <p style={{ color: '#475569', fontSize: '14px' }}>Timeline of all AI deduplication operations</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading history…</div>
        ) : history.length > 0 ? (
          history.map((item, i) => {
            const dupRate = item.total_records ? Math.round((item.duplicate_records / item.total_records) * 100) : 0;
            return (
              <div key={item.id} className="ai-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', animationDelay: `${i * 50}ms` }}>
                <div style={{ padding: '12px', background: 'rgba(0,212,255,0.08)', borderRadius: '12px', boxShadow: '0 0 15px rgba(0,212,255,0.1)' }}>
                  <FileText size={22} color="#00d4ff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '12px' }}>
                    <Calendar size={12} />
                    {new Date(item.upload_date).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Total</p>
                    <p style={{ fontWeight: 700, color: '#94a3b8', fontSize: '18px' }}>{item.total_records}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Unique</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} color="#00ff88" />
                      <p style={{ fontWeight: 700, color: '#00ff88', fontSize: '18px' }}>{item.unique_records}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#ff4757', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Duplicate</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <X size={14} color="#ff4757" />
                      <p style={{ fontWeight: 700, color: '#ff4757', fontSize: '18px' }}>{item.duplicate_records}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '64px' }}>
                    <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Dup Rate</p>
                    <div className="progress-bar" style={{ width: '64px' }}>
                      <div className="progress-fill" style={{ width: `${dupRate}%`, background: dupRate > 50 ? '#ff4757' : '#00d4ff' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{dupRate}%</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="ai-card" style={{ padding: '60px', textAlign: 'center' }}>
            <HistoryIcon size={48} color="#1e293b" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#475569', fontSize: '16px' }}>No upload history yet. Start by uploading a CSV file.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
