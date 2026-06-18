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
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
        <Navbar />
        <main style={{ marginLeft: '260px', flex: 1, padding: '40px', position: 'relative', zIndex: 1 }}>
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
