import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  fullWidth?: boolean;
  className?: string;
  customColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  customColor
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Predefined color schemes - same in both light and dark mode
  const variantClasses = {
    success: 'bg-[#10B981] text-white',
    danger: 'bg-[#EF4444] text-white',
    warning: 'bg-[#F59E0B] text-white',
    info: 'bg-blue-500 text-white',
    default: 'bg-gray-500 text-white'
  };

  // Additional effects for dark mode
  const darkModeGlowEffects = {
    success: isDark ? 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' : '',
    danger: isDark ? 'shadow-[0_0_8px_rgba(239,68,68,0.4)]' : '',
    warning: isDark ? 'shadow-[0_0_8px_rgba(245,158,11,0.4)]' : '',
    info: isDark ? 'shadow-[0_0_8px_rgba(59,130,246,0.4)]' : '',
    default: isDark ? 'shadow-[0_0_8px_rgba(107,114,128,0.4)]' : ''
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-xs py-2 px-5',
    lg: 'text-sm py-2 px-6'
  };

  // Build class string
  const badgeClasses = [
    'font-medium rounded-full inline-flex items-center justify-center',
    sizeClasses[size],
    customColor || variantClasses[variant],
    darkModeGlowEffects[variant],
    fullWidth ? 'w-full' : '',
    className
  ].join(' ');

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge; 