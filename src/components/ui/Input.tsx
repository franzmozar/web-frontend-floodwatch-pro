import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full">
      {icon && (
        <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {icon}
        </div>
      )}
      <input
        className={`w-full py-3 px-4 ${
          icon ? 'pl-10' : 'pl-4'
        } rounded-full border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
          isDark 
            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' 
            : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input; 