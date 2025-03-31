import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ChatPage from './pages/ChatPage';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import PostGrid from './components/PostGrid';
import PostModal from './components/PostModal';
import ChatSidebar from './components/ChatSidebar';
import { api } from './services/api';
import type { TravelPost } from './types/travel';
import type { ChatMessage } from './types/chat';

function App() {
  // State
  const [posts, setPosts] = useState<TravelPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<TravelPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TravelPost | null>(null);
  
  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.getLocations();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts when category or search query changes
  useEffect(() => {
    const filtered = posts.filter(post => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || 
        post.category_type.toLowerCase().includes(activeCategory) ||
        post.theme_highlights.some(theme => theme.toLowerCase().includes(activeCategory));
      
      // Search filter
      if (!searchQuery) return matchesCategory;
      
      const query = searchQuery.toLowerCase();
      return matchesCategory && (
        post.title.toLowerCase().includes(query) ||
        post.content_shorter_version.toLowerCase().includes(query) ||
        post.location_area.toLowerCase().includes(query) ||
        post.theme_highlights.some(theme => theme.toLowerCase().includes(query))
      );
    });
    
    setFilteredPosts(filtered);
  }, [activeCategory, posts, searchQuery]);
  
  // Post interaction handlers
  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, liked: !post.liked } : post
    ));
  };
  
  const handleSave = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
  };
  
  const handleShare = (id: string) => {
    // In a real app, this would open a share dialog
    alert(`Sharing post: ${posts.find(post => post.id === id)?.title}`);
  };
  
  const handleDismiss = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };
  
  const handlePostClick = (post: TravelPost) => {
    setSelectedPost(post);
  };
  
  // AI Assistant handlers
  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      message,
      intent: {
        action: 'filter',
        keywords: message.toLowerCase().split(' ')
      },
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate assistant response based on user input
    setTimeout(() => {
      // Mock AI responses based on keywords in the user message
      let responseMessage = "I'm not sure what you're looking for. Could you be more specific about the type of places you want to see?";
      let intent: ChatMessage['intent'] = { action: 'info' };
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('restaurant')) {
        responseMessage = "I've updated your feed with the best food spots in Singapore! Check out the famous hawker centers for authentic local cuisine.";
        intent = { action: 'filter', category: 'food', keywords: ['food', 'eat', 'restaurant'] };
        setActiveCategory('food');
      } else if (lowerMessage.includes('beach') || lowerMessage.includes('relax') || lowerMessage.includes('swim')) {
        responseMessage = "Looking for some beach time? Sentosa Island has beautiful beaches for relaxation and fun water activities.";
        intent = { action: 'filter', category: 'beach', keywords: ['beach', 'relax', 'swim'] };
        setActiveCategory('beach');
      } else if (lowerMessage.includes('shopping') || lowerMessage.includes('mall') || lowerMessage.includes('buy')) {
        responseMessage = "Singapore is a shopping paradise! I've shown you some great shopping destinations from luxury malls to local markets.";
        intent = { action: 'filter', category: 'shopping', keywords: ['shopping', 'mall', 'buy'] };
        setActiveCategory('shopping');
      } else if (lowerMessage.includes('culture') || lowerMessage.includes('history') || lowerMessage.includes('temple')) {
        responseMessage = "I've found some cultural attractions that showcase Singapore's rich heritage. You'll love exploring these diverse neighborhoods!";
        intent = { action: 'filter', category: 'cultural', keywords: ['culture', 'history', 'temple'] };
        setActiveCategory('cultural');
      } else if (lowerMessage.includes('attraction') || lowerMessage.includes('tourist') || lowerMessage.includes('visit')) {
        responseMessage = "Here are Singapore's top attractions that you shouldn't miss during your visit!";
        intent = { action: 'filter', category: 'attraction', keywords: ['attraction', 'tourist', 'visit'] };
        setActiveCategory('attraction');
      }
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        message: responseMessage,
        intent,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50 relative">
              {loading ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-700">Error</h3>
                    <p className="text-gray-500 mt-2">{error}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Header 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                  <CategoryTabs 
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />
                  
                  <main className="container mx-auto px-4 pb-20 transition-all duration-300">
                    <PostGrid 
                      posts={filteredPosts}
                      isAssistantOpen={isAssistantOpen}
                      searchQuery={searchQuery}
                      onLike={handleLike}
                      onSave={handleSave}
                      onShare={handleShare}
                      onDismiss={handleDismiss}
                      onPostClick={handlePostClick}
                    >
                      {filteredPosts.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                          <div className="bg-gray-100 rounded-full p-6 mb-4">
                            <span className="text-3xl">🔍</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-700">No matches found</h3>
                          <p className="text-gray-500 mt-2 max-w-sm">
                            Try adjusting your search terms or filters to find what you're looking for.
                          </p>
                        </div>
                      )}
                    </PostGrid>
                  </main>
                  
                  <ChatSidebar 
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isOpen={isAssistantOpen}
                    onClose={toggleAssistant}
                  />
                  <PostModal 
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onStartChat={() => {
                      window.location.href = `/chat/${selectedPost?.id}`;
                    }}
                  />
                </>
              )}
            </div>
          }
        />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;