import React, { useState } from 'react';
import { X, MapPin, Clock, DollarSign, Tag, MessageCircle, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import type { TravelPost } from '../types/travel';

interface PostModalProps {
  post: TravelPost | null;
  onClose: () => void;
  onStartChat?: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onStartChat }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!post) return null;

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  const handleStartChat = () => {
    onStartChat?.();
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl bg-white rounded-xl shadow-xl z-[70] overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Image Gallery */}
          <div className="relative aspect-[16/9] max-h-[70vh]">
            <img 
              src={post.images[currentImageIndex]} 
              alt={`${post.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain bg-gray-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
            
            {/* Navigation arrows */}
            {post.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {post.images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {post.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
              {post.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${post.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-rose-500 flex-shrink-0" />
                <span>{post.address || post.location_area}</span>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-blue-500 flex-shrink-0" />
                <span>{post.operating_hours || 'Hours not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-emerald-500 flex-shrink-0" />
                <span>{post.price_range || 'Price not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag size={16} className="text-purple-500 flex-shrink-0" />
                <span>{post.category_type}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Theme highlights */}
            {post.theme_highlights.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {post.theme_highlights.map((theme, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional attributes */}
            {post.additional_attributes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Additional Information</h3>
                <div className="flex flex-wrap gap-2">
                  {post.additional_attributes.map((attr, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with buttons - fixed at bottom */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            {onStartChat && (
              <button
                onClick={handleStartChat}
                className="flex-1 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Chat with Business
              </button>
            )}
            
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Globe size={20} />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;