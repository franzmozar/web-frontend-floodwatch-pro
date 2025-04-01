import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseClasses = 'w-full py-3 px-4 font-medium transition-colors duration-200 focus:outline-none cursor-pointer';
  
  const variantClasses = {
    primary: `${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`,
    secondary: `${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`,
    outline: `${isDark ? 'bg-transparent text-gray-300 border border-gray-600 hover:bg-gray-800' : 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50'}`,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 