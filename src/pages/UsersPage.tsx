import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import DataTable from '../components/ui/DataTable';
import { BadgeVariant } from '../components/ui/Badge';
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import UserManagementDialog from '../components/ui/UserManagementDialog';
import ViewUserDetailsDialog from '../components/ui/ViewUserDetailsDialog';

type NavPage = 'dashboard' | 'users' | 'floodwatch';

interface User {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  contactNo: string;
  gender: string;
  status: string;
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
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Management Dialog state
  const [managementDialogOpen, setManagementDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // View Details Dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);

  // User data
  const [users, setUsers] = useState<User[]>([
    { id: 'U001', name: 'Juan Cruz', location: 'Sabang, Surigao City', coordinates: '9.797810676218921, 125.47253955989012', contactNo: '09829304728', gender: 'Male', status: 'Emergency' },
    { id: 'U002', name: 'Lito Reyes', location: '--', coordinates: '', contactNo: '09672834628', gender: 'Male', status: 'Stable' },
    { id: 'U003', name: 'Bong Santos', location: '--', coordinates: '', contactNo: '09532738493', gender: 'Male', status: 'Stable' },
    { id: 'U004', name: 'Rico Flores', location: '--', coordinates: '', contactNo: '09172345678', gender: 'Male', status: 'Stable' },
    { id: 'U005', name: 'Nene Dela', location: '--', coordinates: '', contactNo: '09284567890', gender: 'Female', status: 'Stable' },
    { id: 'U006', name: 'Junjun Ramos', location: '--', coordinates: '', contactNo: '09356789012', gender: 'Male', status: 'Stable' },
    { id: 'U007', name: 'Tina Lopez', location: '--', coordinates: '', contactNo: '09478901234', gender: 'Female', status: 'Stable' },
    { id: 'U008', name: 'Jessa Mari', location: '--', coordinates: '', contactNo: '09563214567', gender: 'Female', status: 'Stable' },
  ]);

  // Status variant mapping
  const statusVariantMapping: Record<string, BadgeVariant> = {
    'emergency': 'danger',
    'stable': 'success'
  };

  // Column definitions for user table
  const userColumns = [
    { 
      key: 'id', 
      title: 'ID', 
      sortable: true, 
      render: (value: string, record: User) => (
        <button 
          onClick={() => handleViewUserDetails(record)}
          className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
        >
          {value}
        </button>
      )
    },
    { key: 'name', title: 'NAME', sortable: true },
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
          <div>
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
              <p className={isDark ? 'text-gray-300' : 'text-gray-800'}>{value}</p>
            )}
            {record.coordinates && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{record.coordinates}</p>}
          </div>
        );
      }
    },
    { key: 'contactNo', title: 'Contact No.', sortable: true },
    { key: 'gender', title: 'GENDER', sortable: true },
    { 
      key: 'status', 
      title: 'STATUS',
      sortable: true,
      isBadge: true,
      badgeOptions: {
        variantMapping: statusVariantMapping
      }
    },
    { 
      key: 'actions', 
      title: 'ACTIONS',
      sortable: false,
      render: (_: any, record: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(record)}
            className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
            title="Edit User"
          >
            <PencilSquareIcon className="h-5 w-5 text-blue-500" />
          </button>
          <button
            onClick={() => handleDeleteUser(record)}
            className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
            title="Delete User"
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )
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
  const handleViewUserDetails = (user: User) => {
    setSelectedUserDetails(user);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Management Dialog handlers
  const handleAddUser = () => {
    setDialogMode('add');
    setSelectedUser(undefined);
    setManagementDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setManagementDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setDialogMode('delete');
    setSelectedUser(user);
    setManagementDialogOpen(true);
  };

  const handleCloseManagementDialog = () => {
    setManagementDialogOpen(false);
  };

  const handleManagementDialogConfirm = (userData: User | string) => {
    if (typeof userData === 'string') {
      // Handle delete (userData is the user ID)
      setUsers(users.filter(user => user.id !== userData));
    } else {
      // Handle add/edit
      if (dialogMode === 'add') {
        setUsers([...users, userData]);
      } else if (dialogMode === 'edit') {
        setUsers(users.map(user => user.id === userData.id ? userData : user));
      }
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => 
      Object.values(user).some(value => 
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
        {/* Search and Add User Bar */}
        <div className="mb-6 flex items-center justify-between">
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
          <button
            onClick={handleAddUser}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
              isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
        
        {/* Users Table */}
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
              {filteredAndSortedUsers.map((user, index) => (
                <tr key={user.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleViewUserDetails(user)}
                      className={`${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline cursor-pointer`}
                    >
                      {user.id}
                    </button>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                      {user.coordinates ? (
                        <a 
                          href={`https://www.google.com/maps?q=${user.coordinates}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
                        >
                          {user.location}
                        </a>
                      ) : (
                        <p>{user.location}</p>
                      )}
                      {user.coordinates && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.coordinates}</p>}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {user.contactNo}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {user.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-5 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Emergency' 
                        ? 'bg-[#EF4444] text-white' 
                        : 'bg-[#10B981] text-white'
                    } ${isDark ? 'shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
                        title="Edit User"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
                        title="Delete User"
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      </div>

      {/* User Management Dialog */}
      <UserManagementDialog
        isOpen={managementDialogOpen}
        onClose={handleCloseManagementDialog}
        user={selectedUser}
        mode={dialogMode}
        onConfirm={handleManagementDialogConfirm}
      />

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