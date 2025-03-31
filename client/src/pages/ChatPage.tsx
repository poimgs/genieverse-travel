import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TravelPost } from '../data/mockData';

interface ChatPageProps {
  post?: TravelPost;
}

const ChatPage: React.FC<ChatPageProps> = ({ post }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    setMessage('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-semibold">{post?.title || 'Business Chat'}</h1>
              <p className="text-sm text-gray-500">{post?.location_area || 'Direct Message'}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Chat area */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="bg-indigo-50 p-4 rounded-lg mb-4">
          <p className="text-indigo-700 text-sm">
            You are now chatting with the business. Please note that response times may vary.
          </p>
        </div>
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={!message.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;