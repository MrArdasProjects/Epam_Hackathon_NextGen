import React, { useState, useEffect } from 'react';
import ToolCard from '../components/ToolCard';

interface Tool {
  tool: string;
  use: string;
  academic_use: string;
  how_to: string;
  keywords: string[];
  link: string;
  video_link: string;
  rating: number;
  reviewCount: number;
  isFree: boolean;
  category: string;
}

const ToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  // API'den araçları getir
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tools');
        const data = await response.json();
        setTools(data);
        setFilteredTools(data);
      } catch (error) {
        console.error('Araçlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Kategorileri al
  const categories = ['Tümü', ...Array.from(new Set(tools.map(tool => tool.category)))];

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = tools;

    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.academic_use.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, tools]);

  // handleCardClick artık ToolCard içinde yapılıyor

  const handleRatingUpdate = (toolName: string, newRating: number) => {
    // Şimdilik sadece local state güncelle, gerçek uygulamada backend'e gönderilir
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.tool === toolName 
          ? { ...tool, rating: newRating, reviewCount: tool.reviewCount + 1 }
          : tool
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Araçlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 py-16 pt-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">AI Araçları Kataloğu</h1>
          <p className="text-xl text-purple-100">
            Öğrenci hayatınızı kolaylaştıracak yapay zeka araçlarını keşfedin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Arama ve Filtreler */}
        <div className="mb-8 space-y-4">
          {/* Arama Çubuğu */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="mb-6 text-center text-gray-400">
          {filteredTools.length} araç bulundu
        </div>

        {/* Araç Kartları Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard
                key={index}
                tool={tool}
                onCardClick={() => {}} // Artık kullanılmıyor
                onRatingUpdate={handleRatingUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Araç bulunamadı</h3>
            <p className="text-gray-400">
              Arama teriminizi değiştirmeyi veya filtreleri sıfırlamayı deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
