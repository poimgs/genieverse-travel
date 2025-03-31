import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import type { ChatMessage } from '../data/mockData';

interface AIAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ messages, onSendMessage, onClose, isOpen }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button 
          onClick={onClose}
          className="fixed bottom-5 right-5 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all z-30"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat panel */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      
      <div 
        className={`fixed bottom-0 right-0 w-full sm:w-96 bg-white shadow-xl rounded-t-xl sm:rounded-xl z-50 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0 sm:bottom-5 sm:right-5' : 'translate-y-full sm:translate-y-full'
        }`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <MessageSquare size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold">Singapore Travel Assistant</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close Assistant"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Messages area */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 8rem)' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`mb-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <div 
                className={`p-3 rounded-xl ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.message}
              </div>
              <div 
                className={`text-xs mt-1 text-gray-500 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            placeholder="Ask me about food, attractions, or activities..."
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors"
            aria-label="Send message"
            disabled={!input.trim()}
            title={input.trim() ? 'Send message' : 'Please enter a message'}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIAssistant;