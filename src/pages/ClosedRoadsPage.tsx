import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { MagnifyingGlassIcon, PlusIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import ClosedRoadAddDialog from '../components/ui/ClosedRoadAddDialog';
import ClosedRoadDetailsDialog from '../components/ui/ClosedRoadDetailsDialog';
import { NavPage } from '../types/common';
import FloodWatchApiService, { ClosedRoad as ApiClosedRoad } from '../services/floodwatch-api.service';
import { extractErrorMessage } from '../utils/api-utils';

interface ClosedRoad {
  id: string;
  title: string;
  coordinates: string;
  description: string;
  lastUpdated?: string;
}

interface ClosedRoadsPageProps {
  onLogout?: () => void;
  onNavigate?: (page: NavPage) => void;
}

const ClosedRoadsPage: React.FC<ClosedRoadsPageProps> = ({ onLogout, onNavigate }) => {
  usePageTitle('Closed Roads Management');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof ClosedRoad>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // View Details Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedClosedRoad, setSelectedClosedRoad] = useState<ClosedRoad | null>(null);
  
  // Add Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // API loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Closed Roads data
  const [closedRoadsData, setClosedRoadsData] = useState<ClosedRoad[]>([]);
  
  // Fetch closed roads data
  const fetchClosedRoads = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await FloodWatchApiService.getClosedRoads();
      
      // Log the exact structure for debugging
      console.log('Raw API response:', JSON.stringify(response));
      
      // Check if response exists
      if (!response) {
        throw new Error("No response received from server");
      }
      
      // Try to safely access the data
      let transformedData: ClosedRoad[] = [];
      
      try {
        // Handle the API response which might be in various formats
        let roadsArray: any[] = [];
        
        // Check what format the data is in
        if (response.data && Array.isArray(response.data)) {
          // Direct array in response.data
          roadsArray = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Nested in response.data.data (standard ApiResponse format)
          roadsArray = response.data.data;
        } else {
          throw new Error("Server returned data in an unexpected format");
        }
        
        // Now transform the array into our component's data format
        transformedData = roadsArray.map((road: any) => ({
          id: (road?.id || 'Unknown ID').toString(),
          title: (road?.title || 'Untitled Road').toString(),
          coordinates: `${(road?.latitude || '0').toString()}, ${(road?.longitude || '0').toString()}`,
          description: (road?.description || 'No description available').toString()
        }));
        
        console.log('Transformed closed roads data:', transformedData);
      } catch (parseError) {
        console.error('Error parsing response data:', parseError);
        throw new Error("Failed to parse server response");
      }
      
      setClosedRoadsData(transformedData);
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setError(errorMsg);
      console.error('Error fetching closed roads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchClosedRoads();
  }, []);

  // Add new closed road
  const handleAddClosedRoad = async (roadData: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
  }) => {
    try {
      await FloodWatchApiService.addClosedRoad(roadData);
      // Refresh the list after adding
      fetchClosedRoads();
      // Close the dialog
      setAddDialogOpen(false);
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      console.error('Error adding closed road:', errorMsg);
      // You might want to show this error to the user
    }
  };

  // Column definitions for closed roads table
  const columns = [
    { 
      key: 'id', 
      title: 'ID', 
      sortable: true, 
      render: (value: string, record: ClosedRoad) => {
        // Truncate long IDs for better display
        const displayId = value.length > 8 ? `${value.substring(0, 8)}...` : value;
        
        return (
          <button 
            onClick={() => handleViewClosedRoadDetails(record)}
            className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
            title={value} // Show full ID on hover
          >
            {displayId}
          </button>
        );
      }
    },
    { 
      key: 'title', 
      title: 'ROAD NAME', 
      sortable: true,
      render: (value: string) => (
        <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
          {value}
        </span>
      )
    },
    { 
      key: 'coordinates', 
      title: 'COORDINATES', 
      sortable: true,
      render: (value: string) => {
        // Function to create a Google Maps URL from coordinates
        const createMapsUrl = (coords: string) => {
          if (!coords || coords === '') return null;
          return `https://www.google.com/maps?q=${coords}`;
        };
        
        const mapsUrl = createMapsUrl(value);
        
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
          </div>
        );
      }
    },
    { 
      key: 'description', 
      title: 'DESCRIPTION', 
      sortable: true,
      render: (value: string) => {
        // Truncate the description if it's too long
        const maxLength = 100;
        const truncated = value && value.length > maxLength 
          ? `${value.substring(0, maxLength)}...` 
          : value;
        
        return (
          <div className={`max-w-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            {truncated}
          </div>
        );
      }
    }
  ];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field: keyof ClosedRoad) => {
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
  const filteredAndSortedData = closedRoadsData
    .filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortDirection === 'asc' ? -1 : 1;
      if (!bValue) return sortDirection === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Handle navigation
  const handleNavigation = (page: NavPage) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // View Details Dialog handlers
  const handleViewClosedRoadDetails = (road: ClosedRoad) => {
    setSelectedClosedRoad(road);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Add Dialog handlers
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  // Empty state component
  const EmptyState = () => (
    <div className={`text-center py-16 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="mx-auto flex justify-center mb-4">
        <InformationCircleIcon className={`h-12 w-12 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
      </div>
      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>No Closed Roads Found</h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
        There are currently no closed roads in the database. Click the "Add Road" button to add a new closed road.
      </p>
      <div className="mt-6">
        <button
          onClick={handleOpenAddDialog}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Your First Road
        </button>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className={`text-center py-16 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="mx-auto flex justify-center mb-4">
        <ExclamationTriangleIcon className={`h-12 w-12 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
      </div>
      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Failed to Load Data</h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
        {error || "There was an error loading the closed roads. Please try again later."}
      </p>
      <div className="mt-6">
        <button
          onClick={() => fetchClosedRoads()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout
      title="Closed Roads"
      activePage="roads"
      onNavigate={handleNavigation}
      onLogout={onLogout}
    >
      <div>
        {/* Search Bar and Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search closed roads..."
              value={searchTerm}
              onChange={handleSearch}
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' 
                  : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading || !!error || closedRoadsData.length === 0}
            />
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleOpenAddDialog}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-sm"
            disabled={isLoading}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Add Road
          </button>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm">Loading closed roads...</p>
          </div>
        )}
        
        {/* Error State */}
        {!isLoading && error && <ErrorState />}
        
        {/* Empty State */}
        {!isLoading && !error && closedRoadsData.length === 0 && <EmptyState />}
        
        {/* Closed Roads Table */}
        {!isLoading && !error && closedRoadsData.length > 0 && (
          <>
            {/* Search Results Count */}
            {searchTerm && (
              <div className="mb-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filteredAndSortedData.length === 0 
                    ? 'No results found for your search' 
                    : `Found ${filteredAndSortedData.length} result${filteredAndSortedData.length === 1 ? '' : 's'} for "${searchTerm}"`}
                </p>
              </div>
            )}
            
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
                        onClick={column.sortable ? () => handleSort(column.key as keyof ClosedRoad) : undefined}
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
                  {filteredAndSortedData.length > 0 ? (
                    filteredAndSortedData.map((road) => (
                      <tr key={road.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                        {columns.map((column) => {
                          // Special handling for ID column to display truncated value
                          if (column.key === 'id') {
                            return (
                              <td key={`${road.id}-${column.key}`} className="px-6 py-4">
                                <button 
                                  onClick={() => handleViewClosedRoadDetails(road)}
                                  className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
                                  title={road.id}
                                >
                                  {road.id.length > 8 ? `${road.id.substring(0, 8)}...` : road.id}
                                </button>
                              </td>
                            );
                          }
                          
                          // Regular rendering for other columns
                          return (
                            <td key={`${road.id}-${column.key}`} className="px-6 py-4">
                              {column.render(road[column.key as keyof ClosedRoad] as string, road)}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No closed roads found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className={`px-6 py-4 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
                Showing {filteredAndSortedData.length} of {closedRoadsData.length}
                <div className="flex justify-end -mt-6">
                  <div className="flex">
                    <button 
                      className={`px-2 py-1 border rounded-l-md cursor-pointer ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                      disabled={filteredAndSortedData.length === 0}
                    >
                      &lt;
                    </button>
                    <button 
                      className={`px-2 py-1 border-t border-b border-r cursor-pointer ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} rounded-r-md`}
                      disabled={filteredAndSortedData.length === 0}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* View Details Dialog */}
      <ClosedRoadDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        closedRoad={selectedClosedRoad}
      />
      
      {/* Add Closed Road Dialog */}
      <ClosedRoadAddDialog
        isOpen={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddClosedRoad}
      />
    </AdminLayout>
  );
};

export default ClosedRoadsPage; 