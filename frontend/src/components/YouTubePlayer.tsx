import React from 'react';

interface YouTubePlayerProps {
  videoId?: string;
  title: string;
  placeholder: string;
}

const YouTubePlayer = ({ videoId, title, placeholder }: YouTubePlayerProps) => {
  if (!videoId) {
    // Placeholder göster
    return (
      <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-3xl mb-2">▶️</div>
          <p>{placeholder}</p>
          <p className="text-sm">Yakında eklenecek</p>
        </div>
      </div>
    );
  }

  // YouTube embed
  return (
    <div className="aspect-video bg-gray-600 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;

