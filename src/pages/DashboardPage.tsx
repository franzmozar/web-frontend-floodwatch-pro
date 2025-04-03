import React from 'react';
import AdminLayout from '../components/ui/AdminLayout';
import usePageTitle from '../hooks/usePageTitle';
import { UserIcon, BeakerIcon, MapIcon, BellIcon } from '@heroicons/react/24/outline';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import { BadgeVariant } from '../components/ui/Badge';

interface DashboardPageProps {
  onLogout?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  usePageTitle('Dashboard');

  // Mock data for users (matching the image)
  const users = [
    { id: 'U001', location: 'Sabang, Surigao City', coordinates: '9.797810676218921, 125.47253955989012', contact: '09829304728', status: 'Emergency' },
    { id: 'U002', location: '--', coordinates: '', contact: '09672834628', status: 'Stable' },
    { id: 'U003', location: '--', coordinates: '', contact: '09532738493', status: 'Stable' },
  ];

  // Mock data for flood sensors (matching the image)
  const floodSensors = [
    { id: 'F001', location: 'Sabang, Surigao City', coordinates: '9.797728972982693, 125.47283546295859', lastUpdate: '10min ago', risk: 'High' },
    { id: 'F002', location: 'Washington, Surigao City', coordinates: '9.790900787278334, 125.49008145586126', lastUpdate: '7min ago', risk: 'Medium' },
    { id: 'F003', location: 'Taft, Surigao City', coordinates: '9.792503402756566, 125.49458755188736', lastUpdate: '13min ago', risk: 'Safe' },
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

  // Column definitions for user table
  const userColumns = [
    { key: 'id', title: 'User ID', render: (value: string) => <span className="text-blue-500">{value}</span> },
    { 
      key: 'location', 
      title: 'Location',
      render: (value: string, record: any) => (
        <div>
          <p>{value}</p>
          {record.coordinates && <p className="text-xs text-gray-500">{record.coordinates}</p>}
        </div>
      )
    },
    { key: 'contact', title: 'Contact No.' },
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
    { key: 'id', title: 'Sensor ID', render: (value: string) => <span className="text-blue-500">{value}</span> },
    { 
      key: 'location', 
      title: 'Location',
      render: (value: string, record: any) => (
        <div>
          <p>{value}</p>
          {record.coordinates && <p className="text-xs text-gray-500">{record.coordinates}</p>}
        </div>
      )
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

  return (
    <AdminLayout>
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
            viewAllLink="/users"
          />
          
          <DataTable
            title="FloodWatch"
            columns={sensorColumns}
            data={floodSensors}
            viewAllLink="/floodwatch"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage; 