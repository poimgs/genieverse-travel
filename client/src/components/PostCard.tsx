import React from 'react';
import { Heart, Bookmark, Share2, X } from 'lucide-react';
import type { TravelPost } from '../types/travel';
import { iconMap } from '../utils/icons';
import { highlightText } from '../utils/search';

interface PostCardProps {
  post: TravelPost;
  searchQuery: string;
  onPostClick: (post: TravelPost) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onDismiss: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  searchQuery, 
  onPostClick,
  onLike, 
  onSave, 
  onShare, 
  onDismiss 
}) => {
  const LocationIcon = iconMap.location;
  const PriceIcon = iconMap.price;
  const CategoryIcon = iconMap.category;

  return (
    <div 
      className="relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => onPostClick(post)}
    >
      {/* Image container with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.images[0]} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent"></div>
        
        {/* Location tag */}
        <div className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <LocationIcon size={12} className="text-rose-500" />
          <span>{post.location_area}</span>
        </div>
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <PriceIcon size={12} className="text-emerald-500" />
          <span>{post.price_range}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* Title */}
        <h3 className="font-bold text-lg mb-2">
          {searchQuery ? (
            <span dangerouslySetInnerHTML={{ 
              __html: highlightText(post.title, searchQuery) 
            }} />
          ) : (
            post.title
          )}
        </h3>
      
        {/* Category */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <CategoryIcon size={12} />
          <span>{post.category_type}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.theme_highlights.map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLike(post.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            post.liked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSave(post.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            post.saved ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          <Bookmark size={18} fill={post.saved ? "currentColor" : "none"} />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShare(post.id);
          }}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Share2 size={18} />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(post.id);
          }}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;