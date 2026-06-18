import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Records = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ by: 'created_at', order: 'desc' });
  const [page, setPage] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/students`, {
        params: { skip: page * 50, limit: 50, search: search || undefined, sort_by: sort.by, order: sort.order }
      });
      setStudents(data);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
  }, [search, sort, page]);

  const toggleSort = (field) => setSort(prev => ({ by: field, order: prev.by === field && prev.order === 'desc' ? 'asc' : 'desc' }));

  const SortBtn = ({ field, label }) => (
    <button onClick={() => toggleSort(field)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sort.by === field ? '#00d4ff' : '#475569', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}>
      {label} <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="fade-in" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Users size={22} color="#00d4ff" />
            <h2 className="text-gradient" style={{ fontSize: '26px', fontWeight: 800 }}>Unique Records</h2>
          </div>
          <p style={{ color: '#475569', fontSize: '14px' }}>Verified AI-deduplicated student dataset</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search name, email…"
            className="ai-input"
            style={{ paddingLeft: '40px', width: '280px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ai-card" style={{ overflow: 'hidden' }}>
        <table className="ai-table">
          <thead>
            <tr>
              <th><SortBtn field="name" label="Name" /></th>
              <th><SortBtn field="email" label="Email" /></th>
              <th><SortBtn field="phone" label="Phone" /></th>
              <th><SortBtn field="created_at" label="Added" /></th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan="5">
                    <div style={{ height: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </td>
                </tr>
              ))
            ) : students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{s.name}</td>
                  <td style={{ color: '#94a3b8' }}>{s.email}</td>
                  <td style={{ color: '#94a3b8' }}>{s.phone}</td>
                  <td style={{ color: '#475569', fontSize: '13px' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td><span className="badge badge-green">✓ Unique</span></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>No records found. Upload a CSV dataset to begin.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(99,179,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#475569' }}>Showing <b style={{ color: '#94a3b8' }}>{students.length}</b> records</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#94a3b8', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '13px', color: '#94a3b8', padding: '0 8px', fontWeight: 700 }}>Page {page + 1}</span>
            <button disabled={students.length < 50} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#94a3b8', cursor: students.length < 50 ? 'not-allowed' : 'pointer', opacity: students.length < 50 ? 0.4 : 1 }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;
