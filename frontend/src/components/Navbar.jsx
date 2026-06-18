import React from 'react';
import { Layout, Users, History, AlertCircle, BarChart3, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Upload CSV', path: '/upload', icon: Upload },
    { name: 'Records', path: '/records', icon: Users },
    { name: 'History', path: '/history', icon: History },
    { name: 'Duplicates', path: '/duplicates', icon: AlertCircle },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          CA
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-tight">CodeAlpha</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Data Guard</p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="bg-blue-600/5 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-800 mb-1">Cloud Internship</p>
          <p className="text-[10px] text-blue-600/70">Task 1: Redundancy Removal</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
