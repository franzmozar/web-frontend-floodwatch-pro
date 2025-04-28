import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { MagnifyingGlassIcon, PlusIcon, PhotoIcon, LinkIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import EvacuationCenterDetailsDialog from '../components/ui/EvacuationCenterDetailsDialog';
import EvacuationCenterAddDialog from '../components/ui/EvacuationCenterAddDialog';
import { NavPage } from '../types/common';
import FloodWatchApiService, { EvacuationCenter as ApiEvacuationCenter } from '../services/floodwatch-api.service';
import { extractErrorMessage } from '../utils/api-utils';
import EmptyState from '../components/ui/EmptyState';

interface EvacuationCenter {
  id: string;
  title: string;
  coordinates: string;
  descriptionIOS: string | null;
  descriptionIOSImageUrl?: string;
  descriptionAndroid: string;
  lastUpdated?: string;
}

interface EvacuationCentersPageProps {
  onLogout?: () => void;
  onNavigate?: (page: NavPage) => void;
}

const EvacuationCentersPage: React.FC<EvacuationCentersPageProps> = ({ onLogout, onNavigate }) => {
  usePageTitle('Evacuation Centers Management');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Debug logs for props
  useEffect(() => {
    console.log("EvacuationCentersPage: Navigation function exists =", !!onNavigate);
  }, [onNavigate]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof EvacuationCenter>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // View Details Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEvacuationCenter, setSelectedEvacuationCenter] = useState<EvacuationCenter | null>(null);
  
  // Add Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // API loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Evacuation Centers data 
  const [evacuationCentersData, setEvacuationCentersData] = useState<EvacuationCenter[]>([]);

  // Fetch evacuation centers data
  const fetchEvacuationCenters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await FloodWatchApiService.getEvacuationCenters();
      
      // Log the raw response to see its structure
      console.log('Raw evacuation centers response:', JSON.stringify(response));
      
      // Check if response exists
      if (!response) {
        throw new Error("No response received from server");
      }
      
      // Try to safely access and transform data
      let transformedData: EvacuationCenter[] = [];
      
      try {
        // Handle the API response which might be in various formats
        let centersArray: any[] = [];
        
        // Check what format the data is in
        if (response.data && Array.isArray(response.data)) {
          // Direct array in response.data
          centersArray = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Nested in response.data.data (standard ApiResponse format)
          centersArray = response.data.data;
        } else {
          throw new Error("Server returned data in an unexpected format");
        }
        
        // Now transform the array into our component's data format
        transformedData = centersArray.map((center: any) => ({
          id: (center?.id || 'Unknown ID').toString(),
          title: (center?.title || 'Unnamed Center').toString(),
          coordinates: `${(center?.latitude || '0').toString()}, ${(center?.longitude || '0').toString()}`,
          descriptionIOS: null,
          descriptionIOSImageUrl: center?.descriptionImage || null,
          descriptionAndroid: (center?.description || 'No description available').toString()
        }));
        
        console.log('Transformed evacuation center data:', transformedData);
      } catch (parseError) {
        console.error('Error parsing evacuation centers data:', parseError);
        throw new Error("Failed to parse server response");
      }
      
      setEvacuationCentersData(transformedData);
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setError(errorMsg);
      console.error('Error fetching evacuation centers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchEvacuationCenters();
  }, []);

  // Add new evacuation center
  const handleAddEvacuationCenter = async (centerData: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
    descriptionImage: string;
  }) => {
    try {
      await FloodWatchApiService.addEvacuationCenter(centerData);
      // Refresh the list after adding
      fetchEvacuationCenters();
      // Close the dialog
      setAddDialogOpen(false);
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      console.error('Error adding evacuation center:', errorMsg);
      // You might want to show this error to the user
    }
  };

  // View Details Dialog handlers
  const handleViewEvacuationCenterDetails = (evacuationCenter: EvacuationCenter) => {
    setSelectedEvacuationCenter(evacuationCenter);
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

  // Function to get image filename from URL
  const getImageFilename = (url: string | undefined): string => {
    if (!url) return 'No image';
    
    // Check if it's a Google Cloud Storage URL
    if (url.includes('storage.googleapis.com')) {
      const parts = url.split('/');
      return parts[parts.length - 1] || 'Image';
    }
    
    // For other URLs, try to extract the filename
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/');
      return parts[parts.length - 1] || 'Image';
    } catch (e) {
      return 'Image';
    }
  };

  // Column definitions for evacuation centers table
  const columns = [
    { 
      key: 'id', 
      title: 'ID', 
      sortable: true, 
      render: (value: string, record: EvacuationCenter) => {
        // Truncate long IDs for better display
        const displayId = value.length > 8 ? `${value.substring(0, 8)}...` : value;
        
        return (
          <button 
            onClick={() => handleViewEvacuationCenterDetails(record)}
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
      title: 'NAME', 
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
      render: (value: string, record: EvacuationCenter) => {
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
          </div>
        );
      }
    },
    { 
      key: 'descriptionIOSImageUrl', 
      title: 'IMAGE', 
      sortable: false,
      render: (value: string | undefined, record: EvacuationCenter) => {
        if (!value) return <span className="text-gray-400">No image</span>;
        
        const filename = getImageFilename(value);
        
        return (
          <div className="flex items-center space-x-2">
            <LinkIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleViewEvacuationCenterDetails(record);
              }}
              className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline truncate max-w-[180px]`}
              title={filename}
            >
              {filename}
            </a>
          </div>
        );
      }
    },
    { 
      key: 'descriptionAndroid', 
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
    },
  ];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field: keyof EvacuationCenter) => {
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
  const filteredAndSortedData = evacuationCentersData
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
    console.log("EvacuationCentersPage: handleNavigation called with:", page);
    
    if (onNavigate) {
      console.log("EvacuationCentersPage: Calling parent onNavigate");
      onNavigate(page);
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Empty state component
  const EmptyStateComponent = () => (
    <EmptyState 
      title="No Evacuation Centers Found"
      message={searchTerm ? `No evacuation centers match "${searchTerm}". Try adjusting your search criteria.` : "There are currently no evacuation centers in the system."}
      actionLabel={searchTerm ? "Clear Search" : "Add New Center"}
      actionHandler={searchTerm ? () => setSearchTerm('') : () => handleOpenAddDialog()}
    />
  );

  // Error state component
  const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="p-6 flex flex-col items-center justify-center h-64">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-2`}>
        Error Loading Data
      </h3>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4 text-center max-w-md`}>
        We encountered a problem while loading evacuation centers. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Retry
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Evacuation Centers"
      activePage="evacuation"
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
              placeholder="Search evacuation centers..."
              value={searchTerm}
              onChange={handleSearch}
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' 
                  : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading || !!error || evacuationCentersData.length === 0}
            />
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleOpenAddDialog}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-sm"
            disabled={isLoading}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Add Center
          </button>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm">Loading evacuation centers...</p>
          </div>
        )}
        
        {/* Error State */}
        {!isLoading && error && <ErrorState onRetry={fetchEvacuationCenters} />}
        
        {/* Empty State */}
        {!isLoading && !error && evacuationCentersData.length === 0 && <EmptyStateComponent />}
        
        {/* Evacuation Centers Table */}
        {!isLoading && !error && evacuationCentersData.length > 0 && (
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
                        onClick={column.sortable ? () => handleSort(column.key as keyof EvacuationCenter) : undefined}
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
                    filteredAndSortedData.map((center) => (
                      <tr key={center.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleViewEvacuationCenterDetails(center)}
                            className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
                            title={center.id}
                          >
                            {center.id.length > 8 ? `${center.id.substring(0, 8)}...` : center.id}
                          </button>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                          {center.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                            <a 
                              href={`https://www.google.com/maps?q=${center.coordinates}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                            >
                              {center.coordinates}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {center.descriptionIOSImageUrl ? (
                            <div className="flex items-center space-x-2">
                              <LinkIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleViewEvacuationCenterDetails(center);
                                }}
                                className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline truncate max-w-[180px]`}
                                title={getImageFilename(center.descriptionIOSImageUrl)}
                              >
                                {getImageFilename(center.descriptionIOSImageUrl)}
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                          <div className="max-w-sm truncate">
                            {center.descriptionAndroid}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No evacuation centers found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className={`px-6 py-4 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
                Showing {filteredAndSortedData.length} of {evacuationCentersData.length}
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
      <EvacuationCenterDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        evacuationCenter={selectedEvacuationCenter}
      />
      
      {/* Add Evacuation Center Dialog */}
      <EvacuationCenterAddDialog
        isOpen={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddEvacuationCenter}
      />
    </AdminLayout>
  );
};

export default EvacuationCentersPage; 