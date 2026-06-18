import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, Check, X, Layers } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/upload-history');
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upload History</h2>
        <p className="text-gray-500">Track all spreadsheet processing events</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading history...</div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.filename}</h4>
                  <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Calendar size={12} /> {new Date(item.upload_date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total</p>
                  <p className="font-bold text-gray-900">{item.total_records}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-green-500 tracking-wider mb-1">Unique</p>
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Check size={14} />
                    <p className="font-bold">{item.unique_records}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-1">Duplicate</p>
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <X size={14} />
                    <p className="font-bold">{item.duplicate_records}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <Layers className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No upload history yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
