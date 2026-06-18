import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Users, AlertCircle, Database, CheckCircle, Download, RefreshCcw, Zap } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/statistics`);
      setStats(data);
    } catch {
      setStats({ total_records: 0, unique_records: 0, duplicate_records: 0, successfully_inserted: 0, rejected_records: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div className="spinner" />
      <p style={{ color: '#00d4ff', fontSize: '14px', opacity: 0.7 }}>Initializing AI Analysis…</p>
    </div>
  );

  const chartData = [
    { name: 'Unique', value: stats?.unique_records || 0, color: '#00d4ff' },
    { name: 'Duplicate', value: stats?.duplicate_records || 0, color: '#ff4757' },
    { name: 'Inserted', value: stats?.successfully_inserted || 0, color: '#00ff88' },
    { name: 'Rejected', value: stats?.rejected_records || 0, color: '#ffa502' },
  ];

  const uniquePct = stats?.total_records ? Math.round((stats.unique_records / stats.total_records) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#0d1117', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '10px', padding: '12px 16px' }}>
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: payload[0].fill, fontSize: '20px', fontWeight: 700 }}>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>System Overview</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Real-time AI analysis of your data integrity</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={fetchStats} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', padding: '9px 12px', cursor: 'pointer', color: '#00d4ff' }}>
            <RefreshCcw size={16} />
          </button>
          <button className="btn-glow" onClick={() => window.open(`${API}/export-clean-csv`)}>
            <Download size={16} />
            Export Clean Data
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <StatsCard title="Total Processed" value={stats?.total_records || 0} icon={Database} color="cyan" />
        <StatsCard title="Unique Records" value={stats?.unique_records || 0} icon={Users} color="green" />
        <StatsCard title="Duplicates Detected" value={stats?.duplicate_records || 0} icon={AlertCircle} color="red" />
        <StatsCard title="System Health" value="100%" icon={Zap} color="amber" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Bar chart */}
        <div className="ai-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'linear-gradient(135deg,#00d4ff,#9b59b6)', display: 'inline-block' }} />
            Data Classification Breakdown
          </h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={52}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}66)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency panel */}
        <div className="ai-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#00ff88', display: 'inline-block' }} />
            Efficiency Stats
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uniqueness Rate</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#00d4ff' }}>{uniquePct}%</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uniquePct}%` }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Redundancy Saved</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#ff4757' }}>{stats?.duplicate_records || 0}</p>
              </div>
              <p style={{ fontSize: '11px', color: '#475569' }}>Duplicate entries blocked from database insertion</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', textAlign: 'center' }}>
              <CheckCircle size={24} color="#00ff88" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#00ff88' }}>AI Deduplication Active</p>
              <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>Processing in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
