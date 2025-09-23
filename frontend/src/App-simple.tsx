import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import ChatBot from './components/ChatBot';

function Navbar() {
  const [chatSmallOpen, setChatSmallOpen] = useState(false);
  const [chatLargeOpen, setChatLargeOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-6 backdrop-blur-sm bg-white/10 text-white">
        <Link to="/" className="text-xl font-bold hover:text-yellow-400 transition-colors">
          AI Toolkit
        </Link>
        <ul className="flex gap-6 text-sm items-center">
          <li>
            <Link 
              to="/" 
              className={`hover:underline transition-colors ${isActive('/') ? 'text-yellow-400' : ''}`}
            >
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link 
              to="/tools" 
              className={`hover:underline transition-colors ${isActive('/tools') ? 'text-yellow-400' : ''}`}
            >
              Araçlar
            </Link>
          </li>
          <li>
            <button onClick={() => setChatLargeOpen(true)} className="hover:underline">
              Sohbet
            </button>
          </li>
        </ul>
        <button
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-500 transition-all duration-200"
          onClick={() => setChatSmallOpen(true)}
        >
          Sohbete Başla
        </button>
      </nav>

      {/* ChatBot - Sağ altta küçük */}
      <ChatBot open={chatSmallOpen} setOpen={setChatSmallOpen} variant="small" />

      {/* ChatBot - Ortada büyük */}
      <ChatBot open={chatLargeOpen} setOpen={setChatLargeOpen} variant="large" />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:toolName" element={<ToolDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
