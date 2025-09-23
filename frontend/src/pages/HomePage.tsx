import React, { useState } from 'react';
import ChatBot from '../components/ChatBot';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const [chatSmallOpen, setChatSmallOpen] = useState(false);
  const [chatLargeOpen, setChatLargeOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <div className="text-center text-white pt-32 mt-16">
        <h2 className="text-4xl font-bold">{t('homepage.title')}</h2>
        <p className="text-xl mt-4">{t('homepage.subtitle')}</p>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
            onClick={() => setChatLargeOpen(true)}
          >
            {t('homepage.startChat')}
          </button>
          <a
            href="/tools"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 inline-block"
          >
            {t('homepage.exploreTools')}
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
