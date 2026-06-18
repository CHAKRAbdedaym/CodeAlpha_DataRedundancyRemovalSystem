import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldX, Ghost, Mail, Phone, Calendar } from 'lucide-react';

const Duplicates = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/duplicates');
        setDuplicates(response.data);
      } catch (err) {
        console.error('Failed to fetch duplicates');
      } finally {
        setLoading(false);
      }
    };
    fetchDuplicates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Duplicate Report</h2>
          <p className="text-gray-500">Inventory of rejected records and redundancy patterns</p>
        </div>
        <div className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
          <ShieldX size={18} />
          {duplicates.length} Prevented Entries
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
          ))
        ) : duplicates.length > 0 ? (
          duplicates.map((dup) => (
            <div key={dup.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-red-200 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <AlertTriangle size={20} />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={10} /> {new Date(dup.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <h4 className="text-lg font-bold text-gray-900 truncate mb-2">{dup.name || 'Anonymous User'}</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{dup.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={14} className="shrink-0" />
                  <span>{dup.phone}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs font-semibold text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full">
                  {dup.reason}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <Ghost className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium text-lg">No duplicates found. The system is clean!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Duplicates;
