import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import FloodwatchDetailsDialog from '../components/ui/FloodwatchDetailsDialog';

type NavPage = 'dashboard' | 'users' | 'floodwatch';

interface Floodwatch {
  id: string;
  location: string;
  coordinates: string;
  trend: string;
  waterLevel: number;
  rainfall: number;
  lastUpdate: string;
  floodRisk: string;
}

interface FloodWatchPageProps {
  onLogout?: () => void;
  onNavigate?: (page: NavPage) => void;
}

const FloodWatchPage: React.FC<FloodWatchPageProps> = ({ onLogout, onNavigate }) => {
  usePageTitle('FloodWatch Management');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Debug logs for props
  useEffect(() => {
    console.log("FloodWatchPage: Navigation function exists =", !!onNavigate);
  }, [onNavigate]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Sorting state
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // View Details Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedFloodwatch, setSelectedFloodwatch] = useState<Floodwatch | null>(null);

  // FloodWatch data based on the image
  const floodWatchData: Floodwatch[] = [
    { 
      id: 'U001', 
      location: 'Sabang, Surigao City', 
      coordinates: '9.797728972982693, 125.47283546295859', 
      trend: 'Rising', 
      waterLevel: 4.5, 
      rainfall: 12, 
      lastUpdate: '14:35UTC', 
      floodRisk: 'High' 
    },
    { 
      id: 'U002', 
      location: 'Sabang, Surigao City', 
      coordinates: '9.790900787278334, 125.49008145586126', 
      trend: 'Dropping', 
      waterLevel: 3.2, 
      rainfall: 5, 
      lastUpdate: '14:30UTC', 
      floodRisk: 'Medium' 
    },
    { 
      id: 'U003', 
      location: 'Taft, Surigao City', 
      coordinates: '9.792503402756566, 125.49458755188736', 
      trend: 'Stable', 
      waterLevel: 2.0, 
      rainfall: 0, 
      lastUpdate: '14:25UTC', 
      floodRisk: 'Safe' 
    },
  ];


  // Trend icons
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'rising':
        return (
          <span className={`${isDark ? 'text-red-400' : 'text-red-500'} flex items-center`}>
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Rising
          </span>
        );
      case 'dropping':
        return (
          <span className={`${isDark ? 'text-green-400' : 'text-green-500'} flex items-center`}>
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            Dropping
          </span>
        );
      case 'stable':
        return (
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
            Stable
          </span>
        );
      default:
        return trend;
    }
  };

  // View Details Dialog handlers
  const handleViewFloodwatchDetails = (floodwatch: Floodwatch) => {
    // Create a properly formatted object for the FloodwatchDetailsDialog
    setSelectedFloodwatch(floodwatch);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Column definitions for flood watch table
  const columns = [
    { 
      key: 'id', 
      title: 'ID', 
      sortable: true, 
      render: (value: string, record: Floodwatch) => (
        <button 
          onClick={() => handleViewFloodwatchDetails(record)}
          className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
        >
          {value}
        </button>
      )
    },
    { 
      key: 'location', 
      title: 'LOCATION', 
      sortable: true,
      render: (value: string, record: any) => {
        // Function to create a Google Maps URL from coordinates
        const createMapsUrl = (coords: string) => {
          if (!coords || coords === '') return null;
          return `https://www.google.com/maps?q=${coords}`;
        };
        
        const mapsUrl = createMapsUrl(record.coordinates);
        
        return (
          <div className={isDark ? 'text-gray-300' : 'text-gray-800'}>
            {mapsUrl ? (
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
              >
                {value}
              </a>
            ) : (
              <p>{value}</p>
            )}
            {record.coordinates && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{record.coordinates}</p>}
          </div>
        );
      }
    },
    { 
      key: 'trend', 
      title: 'TREND', 
      sortable: true, 
      render: (value: string) => getTrendIcon(value)
    },
    { key: 'waterLevel', title: 'WATER LEVEL (m)', sortable: true },
    { key: 'rainfall', title: 'RAINFALL (mm/hr)', sortable: true },
    { key: 'lastUpdate', title: 'LAST UPDATE', sortable: true },
    { 
      key: 'floodRisk', 
      title: 'FLOOD RISK', 
      sortable: true,
      render: (value: string) => {
        let bgColor = '';
        switch (value.toLowerCase()) {
          case 'high':
            bgColor = 'bg-red-500';
            break;
          case 'medium':
            bgColor = 'bg-yellow-500';
            break;
          case 'safe':
            bgColor = 'bg-emerald-500';
            break;
          default:
            bgColor = 'bg-gray-500';
        }
        return (
          <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} text-white ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
            {value}
          </span>
        );
      }
    },
  ];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = floodWatchData
    .filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Handle navigation
  const handleNavigation = (page: NavPage) => {
    console.log("FloodWatchPage: handleNavigation called with:", page);
    
    if (onNavigate) {
      console.log("FloodWatchPage: Calling parent onNavigate");
      onNavigate(page);
    } else {
      console.error("FloodWatchPage: Navigation function not provided");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <AdminLayout 
      title="FloodWatch Management" 
      activePage="floodwatch"
      onNavigate={handleNavigation}
      onLogout={onLogout}
    >
      <div>
        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search flood data..."
              value={searchTerm}
              onChange={handleSearch}
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' 
                  : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        
        {/* FloodWatch Table */}
        <div className={`overflow-hidden shadow-sm rounded-lg ${isDark ? 'shadow-gray-900' : 'shadow-gray-200'}`}>
          <table className="min-w-full">
            <thead>
              <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDark ? 'text-gray-200' : 'text-gray-600'
                    } uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center">
                      {column.title}
                      {column.sortable && (
                        <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {getSortIndicator(column.key)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredAndSortedData.map((item, index) => (
                <tr key={item.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleViewFloodwatchDetails(item)}
                      className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
                    >
                      {item.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                      {item.coordinates ? (
                        <a 
                          href={`https://www.google.com/maps?q=${item.coordinates}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                        >
                          {item.location}
                        </a>
                      ) : (
                        <p>{item.location}</p>
                      )}
                      {item.coordinates && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.coordinates}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(item.trend)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {item.waterLevel}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {item.rainfall}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {item.lastUpdate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.floodRisk === 'High' 
                        ? 'bg-red-500 text-white' 
                        : item.floodRisk === 'Medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-emerald-500 text-white'
                    } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
                      {item.floodRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={`px-6 py-4 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
            Showing {filteredAndSortedData.length} of {floodWatchData.length}
            <div className="flex justify-end -mt-6">
              <div className="flex">
                <button className={`px-2 py-1 border rounded-l-md cursor-pointer ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
                  &lt;
                </button>
                <button className={`px-2 py-1 border-t border-b border-r cursor-pointer ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} rounded-r-md`}>
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floodwatch Details Dialog */}
      {selectedFloodwatch && (
        <FloodwatchDetailsDialog 
          isOpen={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          floodwatch={{
            id: selectedFloodwatch.id,
            location: selectedFloodwatch.location,
            coordinates: selectedFloodwatch.coordinates,
            waterLevel: `${selectedFloodwatch.waterLevel}m`, // Use actual water level with unit
            status: selectedFloodwatch.floodRisk,
            lastUpdated: selectedFloodwatch.lastUpdate,
            description: `Trend: ${selectedFloodwatch.trend}, Rainfall: ${selectedFloodwatch.rainfall} mm/hr`
          }}
        />
      )}
    </AdminLayout>
  );
};

export default FloodWatchPage; 