import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';

const Records = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ by: 'created_at', order: 'desc' });
  const [page, setPage] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/students', {
        params: {
          skip: page * 50,
          limit: 50,
          search: search || undefined,
          sort_by: sort.by,
          order: sort.order
        }
      });
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, sort, page]);

  const toggleSort = (field) => {
    setSort(prev => ({
      by: field,
      order: prev.by === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Student Records</h2>
          <p className="text-gray-500">Manage and view verified unique records</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email..."
            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900">
                    Name <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-8 py-5">
                  <button onClick={() => toggleSort('email')} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900">
                    Email <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-8 py-5">
                  <button onClick={() => toggleSort('phone')} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900">
                    Phone <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-8 py-5">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900">
                    Created At <ArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 font-medium text-gray-900">{student.name}</td>
                    <td className="px-8 py-5 text-gray-600">{student.email}</td>
                    <td className="px-8 py-5 text-gray-600">{student.phone}</td>
                    <td className="px-8 py-5 text-gray-500 text-sm">{new Date(student.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900">{students.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold px-4">Page {page + 1}</span>
            <button 
              disabled={students.length < 50}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;
