import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { BadgeVariant } from '../components/ui/Badge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import ViewUserDetailsDialog from '../components/ui/ViewUserDetailsDialog';
import FloodWatchApiService from '../services/floodwatch-api.service';
import { NavPage } from '../types/common';
import { UserCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// API User interface for the /web/getusers endpoint
export interface InputLocation {
  address1: string;
  address2: string;
  city: string;
  zipcode: string;
  country: string;
  exactLocation: string | null;
  status: number;
  accountStatus: number;
}

export interface ApiUser {
  user: {
    id: string;
    phoneNumber: string;
    username: string;
  };
  inputLocations: InputLocation[];
}

interface UsersPageProps {
  onLogout?: () => void;
  onNavigate?: (page: NavPage) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ onLogout, onNavigate }) => {
  usePageTitle('User Management');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Debug logs for props
  useEffect(() => {
    console.log("UsersPage: Navigation function exists =", !!onNavigate);
  }, [onNavigate]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Sorting state
  const [sortField, setSortField] = useState<string>('user.id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // View Details Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<ApiUser | null>(null);

  // User data
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await FloodWatchApiService.get('/web/getusers');
        console.log('Users API response:', response);
        if (response?.data) {
          setUsers(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Status variant mapping - using an underscore prefix to indicate intentionally unused var for now
  const _statusVariantMapping: Record<string, BadgeVariant> = {
    '0': 'danger',
    '1': 'success',
    '2': 'warning'
  };

  // Status label mapping
  const statusLabelMapping: Record<string, string> = {
    '0': 'Emergency',
    '1': 'Stable'
  };

  // Account status label mapping
  const accountStatusLabelMapping: Record<string, string> = {
    '0': 'Inactive',
    '1': 'Active',
    '2': 'Restricted'
  };

  // Column definitions for user table
  const userColumns = [
    { 
      key: 'user.id', 
      title: 'ID', 
      sortable: true, 
      render: (_value: string, record: ApiUser) => (
        <button 
          onClick={() => handleViewUserDetails(record)}
          className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
        >
          {record.user.id.substring(0, 8)}...
        </button>
      )
    },
    { 
      key: 'user.username', 
      title: 'USERNAME', 
      sortable: true,
      render: (_value: string, record: ApiUser) => record.user.username
    },
    { 
      key: 'location', 
      title: 'LOCATION',
      sortable: true,
      render: (value: string, record: ApiUser) => {
        const location = record.inputLocations?.[0];
        const address = location ? `${location.address1}, ${location.city}` : '--';
        const exactLocation = location?.exactLocation;
        
        // Function to create a Google Maps URL from coordinates
        const createMapsUrl = (coords: string | null) => {
          if (!coords || coords === '') return null;
          return `https://www.google.com/maps?q=${coords}`;
        };
        
        const mapsUrl = createMapsUrl(exactLocation);
        
        return (
          <div>
            {mapsUrl ? (
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
              >
                {address}
              </a>
            ) : (
              <p className={isDark ? 'text-gray-300' : 'text-gray-800'}>{address}</p>
            )}
            {exactLocation && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{exactLocation}</p>}
          </div>
        );
      }
    },
    { 
      key: 'user.phoneNumber', 
      title: 'Contact No.', 
      sortable: true,
      render: (value: string, record: ApiUser) => record.user.phoneNumber
    },
    { 
      key: 'status', 
      title: 'STATUS',
      sortable: true,
      render: (_value: string, record: ApiUser) => {
        const status = record.inputLocations?.[0]?.status.toString() || '1';
        const statusLabel = statusLabelMapping[status] || 'Stable';
        
        return (
          <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === '0' 
              ? 'bg-[#EF4444] text-white pulse-emergency' 
              : 'bg-[#10B981] text-white'
          } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
            {statusLabel}
          </span>
        );
      }
    },
    { 
      key: 'accountStatus', 
      title: 'ACCOUNT STATUS',
      sortable: true,
      render: (_value: string, record: ApiUser) => {
        const accountStatus = record.inputLocations?.[0]?.accountStatus.toString() || '1';
        const accountStatusLabel = accountStatusLabelMapping[accountStatus] || 'Active';
        
        return (
          <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            accountStatus === '0' 
              ? 'bg-[#6B7280] text-white' 
              : accountStatus === '2'
                ? 'bg-[#F59E0B] text-white'
                : 'bg-[#3B82F6] text-white'
          } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
            {accountStatusLabel}
          </span>
        );
      }
    }
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

  // View Details Dialog handlers
  const handleViewUserDetails = (user: ApiUser) => {
    setSelectedUserDetails(user);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Get nested property value
  const getNestedPropertyValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search in user properties
      if (user.user.id.toLowerCase().includes(searchTermLower) ||
          user.user.username.toLowerCase().includes(searchTermLower) ||
          user.user.phoneNumber.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in location properties if available
      const location = user.inputLocations?.[0];
      if (location) {
        return (
          (location.address1 && location.address1.toLowerCase().includes(searchTermLower)) ||
          (location.address2 && location.address2.toLowerCase().includes(searchTermLower)) ||
          (location.city && location.city.toLowerCase().includes(searchTermLower)) ||
          (location.zipcode && location.zipcode.toLowerCase().includes(searchTermLower)) ||
          (location.country && location.country.toLowerCase().includes(searchTermLower))
        );
      }
      
      return false;
    })
    .sort((a, b) => {
      const aValue = getNestedPropertyValue(a, sortField) || '';
      const bValue = getNestedPropertyValue(b, sortField) || '';
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Handle navigation
  const handleNavigation = (page: NavPage) => {
    console.log("UsersPage: handleNavigation called with:", page);
    
    if (onNavigate) {
      console.log("UsersPage: Calling parent onNavigate");
      onNavigate(page);
    } else {
      console.error("UsersPage: Navigation function not provided");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <AdminLayout 
      title="User Management" 
      activePage="users"
      onNavigate={handleNavigation}
      onLogout={onLogout}
    >
      <div>
        {/* Custom CSS for emergency badge pulse animation */}
        <style>{`
          @keyframes pulse-red {
            0% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
          .pulse-emergency {
            animation: pulse-red 1.5s infinite;
          }
        `}</style>
        
        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search users..."
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
        
        {/* Loading and Error States */}
        {loading && (
          <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading users data...
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        )}
        
        {/* Users Table */}
        {!loading && !error && (
          <div className={`overflow-hidden shadow-sm rounded-lg ${isDark ? 'shadow-gray-900' : 'shadow-gray-200'}`}>
            <table className="min-w-full">
              <thead>
                <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {userColumns.map((column) => (
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
                {filteredAndSortedUsers.length > 0 ? (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.user.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleViewUserDetails(user)}
                          className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
                        >
                          {user.user.id.substring(0, 8)}...
                        </button>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        {user.user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                          {user.inputLocations?.[0]?.exactLocation ? (
                            <a 
                              href={`https://www.google.com/maps?q=${user.inputLocations[0].exactLocation}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                            >
                              {user.inputLocations[0].address1}, {user.inputLocations[0].city}
                            </a>
                          ) : (
                            <p>{user.inputLocations?.[0]?.address1 ? `${user.inputLocations[0].address1}, ${user.inputLocations[0].city}` : '--'}</p>
                          )}
                          {user.inputLocations?.[0]?.exactLocation && (
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.inputLocations[0].exactLocation}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        {user.user.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const status = user.inputLocations?.[0]?.status.toString() || '1';
                          const statusLabel = statusLabelMapping[status] || 'Stable';
                          
                          return (
                            <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              status === '0' 
                                ? 'bg-[#EF4444] text-white pulse-emergency' 
                                : 'bg-[#10B981] text-white'
                            } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
                              {statusLabel}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const accountStatus = user.inputLocations?.[0]?.accountStatus.toString() || '1';
                          const accountStatusLabel = accountStatusLabelMapping[accountStatus] || 'Active';
                          
                          return (
                            <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              accountStatus === '0' 
                                ? 'bg-[#6B7280] text-white' 
                                : accountStatus === '2'
                                  ? 'bg-[#F59E0B] text-white'
                                  : 'bg-[#3B82F6] text-white'
                            } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
                              {accountStatusLabel}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className={`text-center py-16 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
                        <div className="mx-auto flex justify-center mb-4">
                          <UserCircleIcon className={`h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>No Users Found</h3>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
                          {searchTerm ? 
                            `No users match the search term "${searchTerm}". Try adjusting your search criteria.` : 
                            "There are currently no users in the system."}
                        </p>
                        {searchTerm && (
                          <div className="mt-6">
                            <button
                              onClick={() => setSearchTerm('')}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                            >
                              Clear Search
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={`px-6 py-4 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
              Showing {filteredAndSortedUsers.length} of {users.length}
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
        )}
      </div>

      {/* User Details Dialog */}
      <ViewUserDetailsDialog 
        isOpen={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        user={selectedUserDetails}
      />
    </AdminLayout>
  );
};

export default UsersPage; 