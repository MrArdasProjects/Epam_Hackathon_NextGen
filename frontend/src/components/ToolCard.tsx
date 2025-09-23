import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface ToolCardProps {
  tool: Tool;
  onCardClick: (tool: Tool) => void;
  onRatingUpdate: (toolName: string, newRating: number) => void;
}

const ToolCard = ({ tool, onCardClick, onRatingUpdate }: ToolCardProps) => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const navigate = useNavigate();

  const handleStarClick = (starValue: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Kartın tıklama olayını engelle
    setUserRating(starValue);
    onRatingUpdate(tool.tool, starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
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

  const handleCardClick = () => {
    const toolSlug = tool.tool.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/tools/${toolSlug}`);
  };

  return (
    <div
      className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getToolIcon(tool.tool)}</span>
          <h3 className="text-xl font-bold text-white">{tool.tool}</h3>
        </div>
        {tool.isFree ? (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Ücretsiz
          </span>
        ) : (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Ücretli
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {tool.academic_use}
      </p>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
          {tool.category}
        </span>
      </div>

      {/* Rating Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Display Stars */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-lg focus:outline-none"
                onClick={(e) => handleStarClick(star, e)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              >
                <span
                  className={`${
                    star <= (hoveredStar || userRating || tool.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  } ${hoveredStar >= star ? 'scale-110' : ''} transition-all duration-150`}
                >
                  ⭐
                </span>
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {userRating > 0 ? userRating.toFixed(1) : tool.rating.toFixed(1)}
          </span>
        </div>
        
        <span className="text-xs text-gray-500">
          {tool.reviewCount} değerlendirme
        </span>
      </div>

      {/* Keywords */}
      <div className="mt-3 flex flex-wrap gap-1">
        {tool.keywords.slice(0, 3).map((keyword, index) => (
          <span
            key={index}
            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ToolCard;
