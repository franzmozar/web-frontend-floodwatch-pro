import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHandler?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  actionHandler,
  icon
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`text-center py-16 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {icon ? (
        <div className="mx-auto flex justify-center mb-4">
          {icon}
        </div>
      ) : (
        <div className="mx-auto flex justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-12 w-12 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
      )}
      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{title}</h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
        {message}
      </p>
      {actionLabel && actionHandler && (
        <div className="mt-6">
          <button
            onClick={actionHandler}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState; 