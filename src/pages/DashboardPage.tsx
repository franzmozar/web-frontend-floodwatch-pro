import React, { useState } from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { UserIcon, BeakerIcon, MapIcon, BellIcon } from '@heroicons/react/24/outline';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import { BadgeVariant } from '../components/ui/Badge';
import FloodwatchDetailsDialog from '../components/ui/FloodwatchDetailsDialog';
import ViewUserDetailsDialog from '../components/ui/ViewUserDetailsDialog';

interface DashboardPageProps {
  onLogout?: () => void;
  onNavigate?: (page: 'dashboard' | 'users' | 'floodwatch') => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, onNavigate }) => {
  usePageTitle('Dashboard');
  
  // Dialog states
  const [floodwatchDialogOpen, setFloodwatchDialogOpen] = useState(false);
  const [selectedFloodwatch, setSelectedFloodwatch] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock data for users (matching the image)
  const users = [
    { id: 'U001', name: 'User 1', location: 'Sabang, Surigao City', coordinates: '9.797810676218921, 125.47253955989012', contactNo: '09829304728', gender: 'Male', status: 'Emergency' },
    { id: 'U002', name: 'User 2', location: '--', coordinates: '', contactNo: '09672834628', gender: 'Female', status: 'Stable' },
    { id: 'U003', name: 'User 3', location: '--', coordinates: '', contactNo: '09532738493', gender: 'Male', status: 'Stable' },
  ];

  // Mock data for flood sensors (matching the image)
  const floodSensors = [
    { 
      id: 'F001', 
      location: 'Sabang, Surigao City', 
      coordinates: '9.797728972982693, 125.47283546295859', 
      lastUpdate: '10min ago', 
      lastUpdated: '10min ago',
      risk: 'High',
      waterLevel: '4.5m',
      description: 'Rising water levels, heavy rainfall in area',
      status: 'High'
    },
    { 
      id: 'F002', 
      location: 'Washington, Surigao City', 
      coordinates: '9.790900787278334, 125.49008145586126', 
      lastUpdate: '7min ago',
      lastUpdated: '7min ago', 
      risk: 'Medium',
      waterLevel: '3.2m',
      description: 'Moderate rainfall, stable water level',
      status: 'Medium'
    },
    { 
      id: 'F003', 
      location: 'Taft, Surigao City', 
      coordinates: '9.792503402756566, 125.49458755188736', 
      lastUpdate: '13min ago',
      lastUpdated: '13min ago', 
      risk: 'Safe',
      waterLevel: '0.8m',
      description: 'No rainfall, low water level',
      status: 'Safe'
    },
  ];

  // Status variant mapping
  const statusVariantMapping: Record<string, BadgeVariant> = {
    'emergency': 'danger',
    'stable': 'success'
  };

  // Risk variant mapping
  const riskVariantMapping: Record<string, BadgeVariant> = {
    'high': 'danger',
    'medium': 'warning',
    'safe': 'success',
    'low': 'success'
  };

  // Handle floodwatch details dialog
  const handleViewFloodwatchDetails = (floodwatch: any) => {
    setSelectedFloodwatch(floodwatch);
    setFloodwatchDialogOpen(true);
  };

  // Handle user details dialog
  const handleViewUserDetails = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  // Column definitions for user table
  const userColumns = [
    { 
      key: 'id', 
      title: 'User ID', 
      render: (value: string, record: any) => (
        <button 
          onClick={() => handleViewUserDetails(record)} 
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {value}
        </button>
      ) 
    },
    { 
      key: 'location', 
      title: 'Location',
      render: (value: string, record: any) => {
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
                className="text-blue-600 hover:underline"
              >
                {value}
              </a>
            ) : (
              <p>{value}</p>
            )}
            {record.coordinates && <p className="text-xs text-gray-500">{record.coordinates}</p>}
          </div>
        );
      }
    },
    { key: 'contactNo', title: 'Contact No.' },
    { 
      key: 'status', 
      title: 'Status',
      isBadge: true,
      badgeOptions: {
        variantMapping: statusVariantMapping
      }
    },
  ];

  // Column definitions for flood sensor table
  const sensorColumns = [
    { 
      key: 'id', 
      title: 'Sensor ID', 
      render: (value: string, record: any) => (
        <button 
          onClick={() => handleViewFloodwatchDetails(record)} 
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {value}
        </button>
      ) 
    },
    { 
      key: 'location', 
      title: 'Location',
      render: (value: string, record: any) => {
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
                className="text-blue-600 hover:underline"
              >
                {value}
              </a>
            ) : (
              <p>{value}</p>
            )}
            {record.coordinates && <p className="text-xs text-gray-500">{record.coordinates}</p>}
          </div>
        );
      }
    },
    { key: 'lastUpdate', title: 'Last update' },
    { 
      key: 'risk', 
      title: 'Flood Risk',
      isBadge: true,
      badgeOptions: {
        variantMapping: riskVariantMapping
      }
    },
  ];

  // Handle navigation
  const handleNavigation = (page: 'dashboard' | 'users' | 'floodwatch') => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Handle "View All" click for Users table
  const handleViewAllUsers = () => {
    console.log("View all users clicked");
    if (onNavigate) {
      onNavigate('users');
    }
  };

  // Handle "View All" click for FloodWatch table
  const handleViewAllFloodWatch = () => {
    console.log("View all floodwatch clicked");
    if (onNavigate) {
      onNavigate('floodwatch');
    }
  };

  // Close dialog handlers
  const handleCloseFloodwatchDialog = () => {
    setFloodwatchDialogOpen(false);
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
  };

  return (
    <AdminLayout
      title="Dashboard"
      activePage="dashboard"
      onNavigate={handleNavigation}
      onLogout={onLogout}
    >
      <div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value="25"
            trendValue={8.5}
            trendPeriod="yesterday"
            icon={<UserIcon className="w-6 h-6 text-blue-600" />}
            iconBgColor="#EBF5FF"
          />
          
          <StatCard
            title="Active FloodWatch"
            value="3"
            trendValue={200}
            trendPeriod="past week"
            icon={<BeakerIcon className="w-6 h-6 text-green-600" />}
            iconBgColor="#F0FDF4"
          />
          
          <StatCard
            title="Flood Prone Areas"
            value="2"
            trendValue={-3}
            trendPeriod="yesterday"
            icon={<MapIcon className="w-6 h-6 text-orange-600" />}
            iconBgColor="#FFF7ED"
          />
          
          <StatCard
            title="Pending Emergency"
            value="1"
            trendValue={100}
            trendPeriod="yesterday"
            icon={<BellIcon className="w-6 h-6 text-red-600" />}
            iconBgColor="#FEF2F2"
          />
        </div>
        
        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataTable
            title="Users"
            columns={userColumns}
            data={users}
            onViewAll={handleViewAllUsers}
          />
          
          <DataTable
            title="FloodWatch"
            columns={sensorColumns}
            data={floodSensors}
            onViewAll={handleViewAllFloodWatch}
          />
        </div>
        
        {/* Floodwatch Details Dialog */}
        {selectedFloodwatch && (
          <FloodwatchDetailsDialog 
            isOpen={floodwatchDialogOpen}
            onClose={handleCloseFloodwatchDialog}
            floodwatch={{
              id: selectedFloodwatch.id,
              location: selectedFloodwatch.location,
              coordinates: selectedFloodwatch.coordinates,
              waterLevel: selectedFloodwatch.waterLevel,
              status: selectedFloodwatch.risk,
              lastUpdated: selectedFloodwatch.lastUpdated,
              description: selectedFloodwatch.description
            }}
          />
        )}
        
        {/* User Details Dialog */}
        {selectedUser && (
          <ViewUserDetailsDialog
            isOpen={userDialogOpen}
            onClose={handleCloseUserDialog}
            user={selectedUser}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage; 