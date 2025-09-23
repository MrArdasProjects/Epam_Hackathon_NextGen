import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${language === 'tr' ? 'text-yellow-400' : 'text-white/70'}`}>
        TR
      </span>
      
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300 focus:outline-none ${
          language === 'en' ? 'bg-yellow-400' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
            language === 'en' ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium ${language === 'en' ? 'text-yellow-400' : 'text-white/70'}`}>
        EN
      </span>
    </div>
  );
};

export default LanguageSwitch;
