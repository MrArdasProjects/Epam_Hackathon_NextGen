import React, { useState } from 'react';
import ChatBot from './components/ChatBot';

function App() {
  const [chatSmallOpen, setChatSmallOpen] = useState(false);
  const [chatLargeOpen, setChatLargeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg2.jpg')" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 backdrop-blur-sm bg-white/10 text-white">
        <h1 className="text-xl font-bold">AI Toolkit</h1>
        <ul className="flex gap-6 text-sm">
          <li><a href="#">Ana Sayfa</a></li>
          <li><a href="#">Hakkında</a></li>
          <li><a href="#">Araçlar</a></li>
          <li>
            <button onClick={() => setChatLargeOpen(true)} className="hover:underline">
              Sohbet
            </button>
          </li>
        </ul>
        <button
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-500"
          onClick={() => setChatSmallOpen(true)}
        >
          Sohbete Başla
        </button>
      </nav>

      <div className="text-center text-white mt-32">
        <h2 className="text-4xl font-bold">Akademik Yapay Zeka Asistanı</h2>
        <p className="text-xl mt-4">Soru sor, araç keşfet, yardım al.</p>
      </div>

      {/* ChatBot - Sağ altta küçük */}
      <ChatBot open={chatSmallOpen} setOpen={setChatSmallOpen} variant="small" />

      {/* ChatBot - Ortada büyük */}
      <ChatBot open={chatLargeOpen} setOpen={setChatLargeOpen} variant="large" />
    </div>
  );
}

export default App;
