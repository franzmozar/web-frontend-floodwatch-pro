import React from 'react';
import Card from './Card';
import { useTheme } from '../../contexts/ThemeContext';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
}

interface FloodWatchMapProps {
  title?: string;
  locations: Location[];
  className?: string;
  height?: string;
  width?: string;
}

const FloodWatchMap: React.FC<FloodWatchMapProps> = ({
  title = 'FloodWatch Map',
  locations = [],
  className = '',
  height = '400px',
  width = '100%'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Risk color mapping
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>

      {/* Map placeholder - in a real application, this would be replaced with a map component */}
      <div 
        className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} 
        style={{ height, width }}
      >
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Map Component Would Load Here
          </p>
          
          {/* Demo markers - these would be positioned based on coordinates in a real app */}
          {locations.map((location, index) => {
            // For demo purposes, position markers in a grid
            const rows = Math.ceil(Math.sqrt(locations.length));
            const row = Math.floor(index / rows);
            const col = index % rows;
            
            const left = `${(col + 1) * 100 / (rows + 1)}%`;
            const top = `${(row + 1) * 100 / (rows + 1)}%`;
            
            return (
              <div 
                key={location.id}
                className={`absolute w-4 h-4 rounded-full ${getRiskColor(location.risk)} 
                  transform -translate-x-1/2 -translate-y-1/2 border-2 
                  ${isDark ? 'border-gray-800' : 'border-white'} 
                  ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`}
                style={{ left, top }}
                title={`${location.name} - ${location.risk} risk`}
              />
            );
          })}
        </div>
        
        {/* Legend */}
        <div className={`absolute bottom-4 right-4 p-2 rounded-md ${isDark ? 'bg-gray-900/80' : 'bg-white/80'}`}>
          <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Risk Level</div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Low</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>High</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FloodWatchMap; 