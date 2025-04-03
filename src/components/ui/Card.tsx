import React, { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  shadowSize?: 'none' | 'sm' | 'md' | 'lg';
  shadowColor?: string;
  shadowOpacity?: number;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadowSize = 'md',
  shadowColor = '#000000',
  shadowOpacity = 5,
  shadowX = 6,
  shadowY = 6,
  shadowBlur = 54,
  rounded = 'lg',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate shadow based on parameters
  const getBoxShadow = () => {
    if (shadowSize === 'none') return 'none';
    
    // Convert hex color to rgba
    let r = 0, g = 0, b = 0;
    if (shadowColor.startsWith('#')) {
      r = parseInt(shadowColor.slice(1, 3), 16);
      g = parseInt(shadowColor.slice(3, 5), 16);
      b = parseInt(shadowColor.slice(5, 7), 16);
    }
    
    const alpha = shadowOpacity / 100;
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
    return `${shadowX}px ${shadowY}px ${shadowBlur}px ${rgba}`;
  };

  // Determine rounded corners
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  // Get background color based on theme
  const getBgClass = () => isDark ? 'bg-gray-700' : 'bg-white';

  const boxShadow = getBoxShadow();
  const roundedClass = getRoundedClass();
  const bgClass = getBgClass();

  return (
    <div 
      className={`${bgClass} ${roundedClass} p-8 ${className}`}
      style={{ boxShadow }}
    >
      {children}
    </div>
  );
};

export default Card; 