import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search', 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`block w-full py-2 pl-10 pr-3 rounded-full text-sm transition-all ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-gray-100 text-gray-900 border-none placeholder-gray-500 focus:ring-blue-500'
          }`}
          placeholder={placeholder}
        />
      </div>
    </form>
  );
};

export default SearchBar; 