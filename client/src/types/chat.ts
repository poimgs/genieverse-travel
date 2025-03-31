export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  intent?: {
    category?: string;
    keywords?: string[];
    action?: 'filter' | 'recommend' | 'info';
  };
  category?: string;
  keywords?: string[];
  action?: 'filter' | 'recommend' | 'info';
  timestamp: Date;
}
