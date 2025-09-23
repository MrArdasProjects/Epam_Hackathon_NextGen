import React, { createContext, useContext, useState, useEffect } from 'react';

// Dil türleri
export type Language = 'tr' | 'en';

// Kapsamlı çeviri objeleri
const translations = {
  tr: {
    // Navbar
    'navbar.home': 'Ana Sayfa',
    'navbar.tools': 'Araçlar',
    'navbar.chat': 'Sohbet',
    'navbar.startChat': 'Sohbete Başla',
    
    // HomePage
    'homepage.title': 'Öğrenci Yapay Zeka Asistanı',
    'homepage.subtitle': 'Soru sor, araç keşfet, ödevlerinde yardım al.',
    'homepage.startChat': '🤖 Sohbet Başlat',
    'homepage.exploreTools': '🔧 Araçları Keşfet',
    
    // ToolsPage
    'toolsPage.title': 'AI Araçları Kataloğu',
    'toolsPage.subtitle': 'Öğrenci hayatınızı kolaylaştıracak yapay zeka araçlarını keşfedin',
    'toolsPage.search': 'Ara...',
    'toolsPage.toolsFound': 'araç bulundu',
    'toolsPage.noTools': 'Araç bulunamadı',
    'toolsPage.noToolsDesc': 'Arama teriminizi değiştirmeyi veya filtreleri sıfırlamayı deneyin.',
    
    // ToolCard
    'toolCard.free': 'Ücretsiz',
    'toolCard.paid': 'Ücretli',
    'toolCard.reviews': 'değerlendirme',
    'toolCard.visitTool': 'Aracı Ziyaret Et',
    'toolCard.viewDetails': 'Detayları Görüntüle',
    
    // ToolDetailPage
    'toolDetail.loading': 'Araç bilgileri yükleniyor...',
    'toolDetail.notFound': 'Araç Bulunamadı',
    'toolDetail.notFoundDesc': 'Aradığınız araç mevcut değil.',
    'toolDetail.backToTools': 'Araçlar Kataloğuna Dön',
    'toolDetail.back': '← Geri',
    'toolDetail.aiTools': 'AI Araçları',
    'toolDetail.free': 'Ücretsiz',
    'toolDetail.paid': 'Ücretli',
    'toolDetail.reviews': 'değerlendirme',
    'toolDetail.aboutTool': '📋 Araç Hakkında',
    'toolDetail.howToUse': '🚀 Nasıl Kullanılır?',
    'toolDetail.keywords': '🏷️ Anahtar Kelimeler',
    'toolDetail.educationVideos': '🎥 Eğitim Videoları',
    'toolDetail.shortIntro': '📺 Kısa Tanıtım',
    'toolDetail.detailedUsage': '🎓 Detaylı Kullanım',
    'toolDetail.shortDesc': 'aracının temel özelliklerini öğrenin',
    'toolDetail.detailedDesc': 'Adım adım kullanım rehberi ve ipuçları',
    'toolDetail.officialWebsite': '🔗 Resmi Website',
    'toolDetail.visitOfficial': '🌐 {toolName} Resmi Sitesini Ziyaret Et',
    'toolDetail.chatAbout': '💬 {toolName} Hakkında Sohbet',
    'toolDetail.chatGreeting': 'Bu araç hakkında sorularınızı sorabilirsiniz!',
    'toolDetail.chatPlaceholder': '{toolName} hakkında soru sorun...',
    'toolDetail.chatSend': 'Gönder',
    'toolDetail.chatNote': 'Bu araçla ilgili sorularınızı AI asistanımıza sorabilirsiniz. Yanıtlarda verilen linkler tıklanabilir.',
    'toolDetail.chatError': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    
    // ChatBot
    'chatbot.title': 'AI Asistanı 🤖',
    'chatbot.greeting': 'Merhaba! Nasıl yardımcı olabilirim?',
    'chatbot.placeholder': 'Bir şey yaz...',
    'chatbot.send': 'Gönder',
    'chatbot.close': 'Kapat',
    'chatbot.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    
    // Categories
    'category.research': 'Araştırma',
    'category.presentation': 'Sunum',
    'category.writing': 'Yazım',
    'category.education': 'Eğitim',
    'category.video': 'Video',
    'category.planning': 'Planlama',
    'category.assistant': 'Asistan',
    'category.evaluation': 'Değerlendirme',
    'category.general': 'Genel',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.all': 'Tümü',
    'common.send': 'Gönder',
    'common.close': 'Kapat',
    'common.back': 'Geri',
    'common.error': 'Bir hata oluştu'
  },
  en: {
    // Navbar
    'navbar.home': 'Home',
    'navbar.tools': 'Tools',
    'navbar.chat': 'Chat',
    'navbar.startChat': 'Start Chat',
    
    // HomePage
    'homepage.title': 'Student AI Assistant',
    'homepage.subtitle': 'Ask questions, discover tools, get help with your assignments.',
    'homepage.startChat': '🤖 Start Chat',
    'homepage.exploreTools': '🔧 Explore Tools',
    
    // ToolsPage
    'toolsPage.title': 'AI Tools Catalog',
    'toolsPage.subtitle': 'Discover artificial intelligence tools that will make your student life easier',
    'toolsPage.search': 'Search...',
    'toolsPage.toolsFound': 'tools found',
    'toolsPage.noTools': 'No tools found',
    'toolsPage.noToolsDesc': 'Try changing your search term or resetting the filters.',
    
    // ToolCard
    'toolCard.free': 'Free',
    'toolCard.paid': 'Paid',
    'toolCard.reviews': 'reviews',
    'toolCard.visitTool': 'Visit Tool',
    'toolCard.viewDetails': 'View Details',
    
    // ToolDetailPage
    'toolDetail.loading': 'Loading tool information...',
    'toolDetail.notFound': 'Tool Not Found',
    'toolDetail.notFoundDesc': 'The tool you are looking for does not exist.',
    'toolDetail.backToTools': 'Back to Tools Catalog',
    'toolDetail.back': '← Back',
    'toolDetail.aiTools': 'AI Tools',
    'toolDetail.free': 'Free',
    'toolDetail.paid': 'Paid',
    'toolDetail.reviews': 'reviews',
    'toolDetail.aboutTool': '📋 About Tool',
    'toolDetail.howToUse': '🚀 How to Use?',
    'toolDetail.keywords': '🏷️ Keywords',
    'toolDetail.educationVideos': '🎥 Educational Videos',
    'toolDetail.shortIntro': '📺 Short Introduction',
    'toolDetail.detailedUsage': '🎓 Detailed Usage',
    'toolDetail.shortDesc': 'tool\'s key features',
    'toolDetail.detailedDesc': 'Step-by-step usage guide and tips',
    'toolDetail.officialWebsite': '🔗 Official Website',
    'toolDetail.visitOfficial': '🌐 Visit {toolName} Official Site',
    'toolDetail.chatAbout': '💬 Chat About {toolName}',
    'toolDetail.chatGreeting': 'You can ask questions about this tool!',
    'toolDetail.chatPlaceholder': 'Ask about {toolName}...',
    'toolDetail.chatSend': 'Send',
    'toolDetail.chatNote': 'You can ask our AI assistant questions about this tool. Links in responses are clickable.',
    'toolDetail.chatError': 'An error occurred. Please try again.',
    
    // ChatBot
    'chatbot.title': 'AI Assistant 🤖',
    'chatbot.greeting': 'Hello! How can I help you?',
    'chatbot.placeholder': 'Type something...',
    'chatbot.send': 'Send',
    'chatbot.close': 'Close',
    'chatbot.error': 'An error occurred. Please try again.',
    
    // Categories
    'category.research': 'Research',
    'category.presentation': 'Presentation',
    'category.writing': 'Writing',
    'category.education': 'Education',
    'category.video': 'Video',
    'category.planning': 'Planning',
    'category.assistant': 'Assistant',
    'category.evaluation': 'Evaluation',
    'category.general': 'General',
    
    // Common
    'common.loading': 'Loading...',
    'common.all': 'All',
    'common.send': 'Send',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.error': 'An error occurred'
  }
};

// Context tipi
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { [key: string]: string }) => string;
}

// Context oluştur
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // LocalStorage'dan dil tercihini al, yoksa varsayılan Türkçe
    const savedLang = localStorage.getItem('preferred-language') as Language;
    return savedLang || 'tr';
  });

  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Çeviri fonksiyonu
  const t = (key: string, params?: { [key: string]: string }): string => {
    // Özel durum: dil kodunu döndür
    if (key === 'language') return language;
    
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    let result = translation || key;
    
    // Parameter replacement
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(param => {
        result = result.replace(`{${param}}`, params[param]);
      });
    }
    
    return result;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
