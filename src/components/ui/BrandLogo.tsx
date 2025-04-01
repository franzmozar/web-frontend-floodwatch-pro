import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | number;
  showText?: boolean;
  className?: string;
  textSize?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = '6xl', 
  showText = true,
  className = '',
  textSize = 'text-base'
}) => {
  
  // Handle numeric sizes (in px) or predefined tailwind sizes
 
  
  return (
    <div className={`text-center ${className}`}>
      <h1 
        className={`font-abril ${typeof size === 'number' ? '' : `text-${size}`}`}
        style={{
          ...(typeof size === 'number' ? { fontSize: `${size}px` } : {}),
          lineHeight: 1.1
        }}
      >
        <span style={{ color: '#38b6ff' }}>E</span>
        <span style={{ color: '#5271ff' }}>N</span>
        <span style={{ color: '#38b6ff' }}>S</span>
      </h1>
      {showText && (
        <p 
          style={{ color: '#5271ff' }} 
          className={`mt-2 ${textSize}`}
        >
          Mobile Service
        </p>
      )}
    </div>
  );
};

export default BrandLogo; 