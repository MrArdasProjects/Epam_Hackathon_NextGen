import React, { useState } from 'react';
import ChatBot from '../components/ChatBot';

const HomePage = () => {
  const [chatSmallOpen, setChatSmallOpen] = useState(false);
  const [chatLargeOpen, setChatLargeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <div className="text-center text-white pt-32 mt-16">
        <h2 className="text-4xl font-bold">Akademik Yapay Zeka Asistanı</h2>
        <p className="text-xl mt-4">Soru sor, araç keşfet, yardım al.</p>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
            onClick={() => setChatLargeOpen(true)}
          >
            🤖 Sohbet Başlat
          </button>
          <a
            href="/tools"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 inline-block"
          >
            🔧 Araçları Keşfet
          </a>
        </div>
      </div>

      {/* ChatBot - Sağ altta küçük */}
      <ChatBot open={chatSmallOpen} setOpen={setChatSmallOpen} variant="small" />

      {/* ChatBot - Ortada büyük */}
      <ChatBot open={chatLargeOpen} setOpen={setChatLargeOpen} variant="large" />
    </div>
  );
};

export default HomePage;
