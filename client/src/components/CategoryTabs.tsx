import React from 'react';
import { Utensils, Building2, Landmark, ShoppingBag, Music, Bus } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, setActiveCategory }) => {
  const categories: CategoryOption[] = [
    { id: 'food', name: 'Food & Beverage', icon: <Utensils size={18} /> },
    { id: 'accommodation', name: 'Accommodation', icon: <Building2 size={18} /> },
    { id: 'attraction', name: 'Attraction', icon: <Landmark size={18} /> },
    { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={18} /> },
    { id: 'entertainment', name: 'Entertainment/Nightlife', icon: <Music size={18} /> },
    { id: 'transport', name: 'Transport', icon: <Bus size={18} /> },
  ];
  
  return (
    <div className="bg-white sticky top-14 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <div className="flex space-x-2 py-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;