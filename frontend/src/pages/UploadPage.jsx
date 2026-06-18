import React from 'react';
import CSVUpload from '../components/CSVUpload';
import { Cpu } from 'lucide-react';

const UploadPage = () => (
  <div className="fade-in" style={{ maxWidth: '800px' }}>
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ padding: '10px', background: 'rgba(0,212,255,0.1)', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}>
          <Cpu size={22} color="#00d4ff" />
        </div>
        <h2 className="text-gradient" style={{ fontSize: '26px', fontWeight: 800 }}>Upload CSV Dataset</h2>
      </div>
      <p style={{ color: '#475569', fontSize: '14px', marginLeft: '50px' }}>
        AI-powered deduplication — upload your dataset and let the system classify records in real-time.
      </p>
    </div>

    <div className="ai-card" style={{ padding: '36px' }}>
      <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', fontSize: '13px', color: '#64748b' }}>
        <span style={{ color: '#00d4ff', fontWeight: 700 }}>CSV Requirements: </span>
        Must include <span style={{ color: '#94a3b8', fontWeight: 600 }}>name</span>, <span style={{ color: '#94a3b8', fontWeight: 600 }}>email</span>, and <span style={{ color: '#94a3b8', fontWeight: 600 }}>phone</span> columns. Duplicates are detected by email address.
      </div>
      <CSVUpload />
    </div>
  </div>
);

export default UploadPage;
