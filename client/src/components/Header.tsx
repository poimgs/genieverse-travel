import React from 'react';
import { Compass, Search, MapPin, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const handleSearchClear = () => {
    onSearchChange('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-2">
              <Compass size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              SingaDiscover
            </h1>
          </div>

          {/* Centered search bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search places..."
                className="w-64 sm:w-96 pl-9 pr-8 py-2 rounded-full bg-gray-100 
                         text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:bg-white transition-all shadow-sm hover:shadow-md"
              />
              <Search 
                size={16} 
                className="absolute left-3 text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-2 p-1 rounded-full hover:bg-gray-200 
                           text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <MapPin size={16} className="text-rose-500" />
            <span>Singapore</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;