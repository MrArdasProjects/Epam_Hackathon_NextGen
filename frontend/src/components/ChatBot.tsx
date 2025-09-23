import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mesajları parse eden component
const MessageContent = ({ text }: { text: string }) => {
  const navigate = useNavigate();
  
  // URL'leri detect et
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return (
    <span>
      {parts.map((part, index) => {
        // Eğer bu part bir URL ise
        if (part.match(urlRegex)) {
          if (part.includes('localhost:3000/tools/')) {
            // Internal link - React Router ile yönlendir
            const toolPath = part.replace('http://localhost:3000', '');
            return (
              <button
                key={index}
                onClick={() => navigate(toolPath)}
                className="text-purple-400 underline hover:text-purple-300 font-medium cursor-pointer"
              >
                {part}
              </button>
            );
          } else {
            // External link - yeni sekmede aç
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                {part}
              </a>
            );
          }
        } else {
          // Normal text - line breaks'i handle et
          return part.split('\n').map((line, lineIndex, arr) => (
            <React.Fragment key={`${index}-${lineIndex}`}>
              {line}
              {lineIndex < arr.length - 1 && <br />}
            </React.Fragment>
          ));
        }
      })}
    </span>
  );
};


interface ChatBotProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  variant?: 'small' | 'large';
}

const ChatBot = ({ open, setOpen, variant = 'small' }: ChatBotProps) => {
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Merhaba! Nasıl yardımcı olabilirim?' },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = async () => {
  if (!input.trim()) return;

  const userText = input;
  setMessages([...messages, { from: 'user', text: userText }]);
  setInput('');

  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText }),
    });

    const data = await res.json();

    setMessages(prev => [...prev, { from: 'bot', text: data.response }]);
  } catch (err) {
    console.error("API hatası:", err);
    setMessages(prev => [...prev, { from: 'bot', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' }]);
  }
};


  if (!open) return null;

  const baseClasses = 'shadow-xl rounded-xl flex flex-col overflow-hidden z-50 bg-white';
  const small = 'fixed bottom-6 right-6 w-80 max-h-[80vh]';
  const large = 'fixed inset-0 max-w-3xl mx-auto my-10 border border-gray-300';

  return (
    <div className={`${baseClasses} ${variant === 'small' ? small : large}`}>
      {/* Başlık */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-500 text-white p-4 font-bold flex justify-between items-center">
        AI Asistanı 🤖
        <button onClick={() => setOpen(false)} className="text-white font-light text-sm hover:underline">
          Kapat ✕
        </button>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
  <div
    key={idx}
    className={`p-2 rounded-lg text-sm max-w-[80%] ${
      msg.from === 'bot'
        ? 'bg-gray-200 text-gray-800 self-start'
        : 'bg-blue-500 text-white self-end ml-auto'
    }`}
  >
    <MessageContent text={msg.text} />
  </div>
))}
      </div>

      {/* Giriş */}
      <div className="flex border-t p-2 bg-white">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-1 text-sm focus:outline-none"
          placeholder="Bir şey yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-purple-600 text-white px-4 rounded-r hover:bg-purple-700"
          onClick={handleSend}
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
