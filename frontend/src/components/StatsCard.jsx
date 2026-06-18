import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
