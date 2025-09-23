import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer';
import { useLanguage } from '../contexts/LanguageContext';

interface Tool {
  tool: string;
  use: string;
  academic_use: string;
  how_to: string;
  keywords: string[];
  link: string;
  video_link: string;
  short_video?: string;
  long_video?: string;
  rating: number;
  reviewCount: number;
  isFree: boolean;
  category: string;
}

const ToolDetailPage = () => {
  const { toolName } = useParams<{ toolName: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [chatMessages, setChatMessages] = useState<Array<{from: string, text: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  // Dil değiştiğinde chat mesajını sıfırla
  useEffect(() => {
    setChatMessages([
      { from: 'bot', text: t('toolDetail.chatGreeting') }
    ]);
  }, [t]);

  // Tool bilgilerini getir
  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tools?language=${t('language') || 'tr'}`);
        const tools = await response.json();
        const foundTool = tools.find((t: Tool) => 
          t.tool.toLowerCase().replace(/[^a-z0-9]/g, '-') === toolName
        );
        setTool(foundTool || null);
      } catch (error) {
        console.error('Araç bilgileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (toolName) {
      fetchTool();
    }
  }, [toolName, t]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || !tool) return;

    const userMessage = chatInput;
    const updatedMessages = [...chatMessages, { from: 'user', text: userMessage }];
    setChatMessages(updatedMessages);
    setChatInput('');

    try {
      // Tool-specific chat - artık tool_name parametresi gönderiyoruz
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          language: t('language') || 'tr',
          conversation_history: updatedMessages,
          tool_name: tool.tool // Tool-specific chat için
        }),
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { from: 'bot', text: data.response }]);
    } catch (err) {
      console.error("Chat hatası:", err);
      setChatMessages(prev => [...prev, { 
        from: 'bot', 
        text: t('toolDetail.chatError')
      }]);
    }
  };

  const getToolIcon = (toolName: string) => {
    const icons: { [key: string]: string } = {
      'Consensus': '📄',
      'Gamma.app': '📊',
      'Quizgecko': '❓',
      'Elicit': '🔍',
      'Scite.ai': '✅',
      'DeepL Write': '✍️',
      'Pictory': '🎥',
      'Teachermatic': '🎯',
      'Scholar GPT': '🤖',
      'Grammarly': '📝',
      'QuillBot': '📰',
      'Eduaide.ai': '📚',
      'ClassPoint': '🎪',
      'Mindgrasp': '🧠',
      'SlidesAI': '🎨'
    };
    return icons[toolName] || '🔧';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('toolDetail.loading')}</div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">{t('toolDetail.notFound')}</h2>
          <p className="mb-6">{t('toolDetail.notFoundDesc')}</p>
          <Link 
            to="/tools" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('toolDetail.backToTools')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 py-16 pt-24">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/tools" 
              className="text-purple-200 hover:text-white transition-colors"
            >
              {t('toolDetail.back')}
            </Link>
            <span className="text-purple-200">|</span>
            <span className="text-sm text-purple-200">{t('toolDetail.aiTools')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-6xl">{getToolIcon(tool.tool)}</div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold">{tool.tool}</h1>
                {tool.isFree ? (
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    {t('toolDetail.free')}
                  </span>
                ) : (
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                    {t('toolDetail.paid')}
                  </span>
                )}
              </div>
              <p className="text-xl text-purple-100 mb-4">{tool.academic_use}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= tool.rating ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className="ml-2 text-purple-200">
                    {tool.rating.toFixed(1)} ({tool.reviewCount} {t('toolDetail.reviews')})
                  </span>
                </div>
                <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                  {tool.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-8">
            {/* Araç Açıklaması */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">{t('toolDetail.aboutTool')}</h2>
              <p className="text-gray-300 mb-4">{tool.academic_use}</p>
              
              <h3 className="text-lg font-semibold mb-2">{t('toolDetail.howToUse')}</h3>
              <p className="text-gray-300 mb-4">{tool.how_to}</p>

              <h3 className="text-lg font-semibold mb-2">{t('toolDetail.keywords')}</h3>
              <div className="flex flex-wrap gap-2">
                {tool.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Bölümleri */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">{t('toolDetail.educationVideos')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kısa Tanıtım Videosu */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">{t('toolDetail.shortIntro')}</h3>
                  <div className="mb-3">
                    <YouTubePlayer
                      videoId={tool.short_video}
                      title={`${tool.tool} - ${t('toolDetail.shortIntro')}`}
                      placeholder={t('toolDetail.shortIntro')}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    {tool.tool} {t('toolDetail.shortDesc')}
                  </p>
                </div>

                {/* Detaylı Kullanım Videosu */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">{t('toolDetail.detailedUsage')}</h3>
                  <div className="mb-3">
                    <YouTubePlayer
                      videoId={tool.long_video}
                      title={`${tool.tool} - ${t('toolDetail.detailedUsage')}`}
                      placeholder={t('toolDetail.detailedUsage')}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    {t('toolDetail.detailedDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Resmi Site Linki */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">{t('toolDetail.officialWebsite')}</h2>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {t('toolDetail.visitOfficial', { toolName: tool.tool })}
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Sohbet Bölümü */}
          <div className="bg-gray-800 rounded-xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">{t('toolDetail.chatAbout', { toolName: tool.tool })}</h2>
            
            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm max-w-[85%] ${
                    msg.from === 'bot'
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white ml-auto'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('toolDetail.chatPlaceholder', { toolName: tool.tool })}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleChatSend}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('toolDetail.chatSend')}
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">
              {t('toolDetail.chatNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
