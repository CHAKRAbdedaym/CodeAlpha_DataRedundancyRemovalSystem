import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import Records from './pages/Records';
import History from './pages/History';
import Duplicates from './pages/Duplicates';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <Navbar />
        
        <main className="ml-64 flex-1 p-10 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/records" element={<Records />} />
            <Route path="/history" element={<History />} />
            <Route path="/duplicates" element={<Duplicates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
