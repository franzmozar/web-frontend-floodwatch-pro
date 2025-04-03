import React, { ReactNode } from 'react';
import Card from './Card';
import { useTheme } from '../../contexts/ThemeContext';

interface TrendIndicatorProps {
  value: number;
  period?: string;
  className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ 
  value, 
  period = 'yesterday', 
  className = '' 
}) => {
  const isPositive = value >= 0;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className={`flex items-center ${trendColor} text-sm ${className}`}>
      {isPositive ? (
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7L7 17M7 17H16M7 17V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span>{Math.abs(value)}% {isPositive ? 'Up' : 'Down'} from {period}</span>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor?: string;
  trendValue?: number;
  trendPeriod?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor = 'white',
  trendValue,
  trendPeriod,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card
      className={className}
      shadowX={6}
      shadowY={6}
      shadowBlur={54}
      shadowOpacity={5}
      shadowColor="#000000"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</h2>
          <p className="text-4xl font-bold mt-2">{value}</p>
          {typeof trendValue === 'number' && (
            <TrendIndicator 
              value={trendValue} 
              period={trendPeriod} 
              className="mt-3" 
            />
          )}
        </div>
        <div 
          className="h-14 w-14 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 