import React from 'react';
import { FunnelIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { useTheme } from '../../contexts/ThemeContext';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  activeFilter: string | null;
  onFilterSelect: (filterId: string) => void;
  onResetFilter: () => void;
  filterOptions: FilterOption[];
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterSelect,
  onResetFilter,
  filterOptions,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={`mb-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center">
          <div className="p-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
          </div>
          <span className={`mr-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Filter By
          </span>
        </div>
        
        {filterOptions.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.id)}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeFilter === filter.id 
                ? 'bg-blue-600 text-white' 
                : isDark 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.label}
            {activeFilter === filter.id && (
              <span className="ml-2">↓</span>
            )}
          </button>
        ))}
        
        <div className="ml-auto">
          <button
            onClick={onResetFilter}
            className="flex items-center px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <XCircleIcon className="w-5 h-5 mr-1" />
            Reset Filter
          </button>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar; 