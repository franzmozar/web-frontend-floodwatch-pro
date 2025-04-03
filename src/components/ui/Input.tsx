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
        <div className={`absolute inset-y-0 left-5 flex items-center pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {icon}
        </div>
      )}
      <input
        className={`w-full py-4 px-5 ${
          icon ? 'pl-12' : 'pl-5'
        } rounded-full border ${
          isDark 
            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' 
            : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
        } focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input; 