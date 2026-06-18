import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, AlertCircle, Database, CheckCircle, Download, RefreshCcw } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/statistics');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <RefreshCcw className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const chartData = [
    { name: 'Unique', value: stats?.unique_records || 0, color: '#2563eb' },
    { name: 'Duplicate', value: stats?.duplicate_records || 0, color: '#ef4444' },
    { name: 'Inserted', value: stats?.successfully_inserted || 0, color: '#10b981' },
    { name: 'Rejected', value: stats?.rejected_records || 0, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h2>
          <p className="text-gray-500">Real-time insights into your data redundancy status</p>
        </div>
        <button 
          onClick={() => window.open('http://localhost:8000/export-clean-csv')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Download size={18} />
          Export Clean Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Processed" 
          value={stats?.total_records || 0} 
          icon={Database} 
          color="blue" 
        />
        <StatsCard 
          title="Unique Records" 
          value={stats?.unique_records || 0} 
          icon={Users} 
          color="green" 
        />
        <StatsCard 
          title="Duplicates Detected" 
          value={stats?.duplicate_records || 0} 
          icon={AlertCircle} 
          color="red" 
        />
        <StatsCard 
          title="Status Health" 
          value="100%" 
          icon={CheckCircle} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Data Classification Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Efficiency Stats</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-gray-500">Uniqueness Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total_records ? Math.round((stats.unique_records / stats.total_records) * 100) : 0}%
                </p>
              </div>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${stats?.total_records ? (stats.unique_records / stats.total_records) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-gray-500">Redundancy Save</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.duplicate_records || 0}
                </p>
              </div>
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">Entries Prevented</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
