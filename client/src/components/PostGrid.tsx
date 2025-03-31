import React from 'react';
import PostCard from './PostCard';
import type { TravelPost } from '../types/travel';

interface PostGridProps {
  posts: TravelPost[];
  isAssistantOpen: boolean;
  searchQuery: string;
  onPostClick: (post: TravelPost) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onDismiss: (id: string) => void;
  children?: React.ReactNode;
}

const PostGrid: React.FC<PostGridProps> = ({ 
  posts, 
  isAssistantOpen,
  searchQuery, 
  onPostClick,
  onLike, 
  onSave, 
  onShare, 
  onDismiss,
  children 
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-4 pb-24 transition-all duration-300 ${
      isAssistantOpen ? 'sm:mr-[380px]' : ''
    }`}>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onPostClick={onPostClick}
          searchQuery={searchQuery}
          onLike={onLike}
          onSave={onSave}
          onShare={onShare}
          onDismiss={onDismiss}
        />
      ))}
      {children}
    </div>
  );
};

export default PostGrid;