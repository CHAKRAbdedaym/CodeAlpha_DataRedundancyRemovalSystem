import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileUp, CheckCircle, AlertCircle, Cpu } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const CSVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.csv')) { setFile(f); setError(null); }
    else setError('Please upload a valid .csv file.');
  };
  const handleFileChange = (e) => { if (e.target.files[0]) { setFile(e.target.files[0]); setError(null); } };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await axios.post(`${API}/upload-csv`, formData);
      setResult(data);
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Drop zone */}
      <div
        className={`drag-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', cursor: 'pointer', background: file ? 'rgba(0,212,255,0.03)' : 'transparent', borderColor: file ? 'rgba(0,212,255,0.5)' : undefined }}
      >
        <div style={{
          width: '72px', height: '72px',
          background: file ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: file ? '0 0 30px rgba(0,212,255,0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          {file ? <FileUp size={32} color="#00d4ff" /> : <Upload size={32} color="#475569" />}
        </div>
        {file ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00d4ff', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{file.name}</p>
            <p style={{ color: '#475569', fontSize: '13px' }}>{(file.size / 1024).toFixed(2)} KB · Ready to process</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>Drop your CSV dataset here</p>
            <p style={{ color: '#475569', fontSize: '13px' }}>or click to browse files</p>
          </div>
        )}
        <input type="file" id="fileInput" style={{ display: 'none' }} accept=".csv" onChange={handleFileChange} />
        <label htmlFor="fileInput" style={{
          padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
          color: '#00d4ff', cursor: 'pointer', transition: 'all 0.2s',
        }} onClick={e => e.stopPropagation()}>
          {file ? 'Change File' : 'Select File'}
        </label>
      </div>

      {/* Process button */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className={!file || loading ? '' : 'btn-glow'}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '15px',
          cursor: !file || loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          background: !file || loading ? 'rgba(255,255,255,0.04)' : undefined,
          border: !file || loading ? '1px solid rgba(255,255,255,0.06)' : 'none',
          color: !file || loading ? '#475569' : undefined,
          boxShadow: !file || loading ? 'none' : undefined,
        }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
            AI Processing Records…
          </>
        ) : (
          <>
            <Cpu size={18} />
            Process Dataset with AI
          </>
        )}
      </button>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} color="#ff4757" />
          <p style={{ color: '#ff4757', fontSize: '14px', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {result && (
        <div className="ai-card fade-in" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CheckCircle size={24} color="#00ff88" />
            <p style={{ fontWeight: 700, color: '#00ff88', fontSize: '16px' }}>Dataset Processed Successfully</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Total', value: result.summary.total_records, color: '#00d4ff' },
              { label: 'Unique', value: result.summary.unique_records, color: '#00ff88' },
              { label: 'Duplicate', value: result.summary.duplicate_records, color: '#ff4757' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '8px' }}>{s.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
