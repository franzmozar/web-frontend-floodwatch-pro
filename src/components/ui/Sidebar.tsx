import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import BrandLogo from './BrandLogo';
import { DashboardIcon, FloodWatchIcon, UsersIcon, LogoutIcon, EvacuationCenterIcon } from './icons';
import LogoutConfirmation from './LogoutConfirmation';
import { MapIcon } from '@heroicons/react/24/outline';
import { NavPage } from '../../types/common';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  id: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick, id }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center w-full px-5 py-4 my-1 transition-all duration-200 rounded hover:cursor-pointer ${
        active 
          ? 'bg-indigo-500 text-white' 
          : isDark
            ? 'text-gray-300 hover:bg-indigo-800/20 hover:text-indigo-300'
            : 'text-gray-700 hover:bg-indigo-50'
      }`}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      <span className={`${active ? 'font-medium' : 'font-normal'} ml-4 text-sm`}>{label}</span>
    </button>
  );
};

interface SidebarProps {
  activePage?: NavPage;
  onNavigate?: (page: NavPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'dashboard', onNavigate }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const isDark = theme === 'dark';
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ 
    display: 'none',
    left: 0,
    top: 0,
    height: 0
  });

  const handleNavigate = (page: NavPage) => {
    console.log("Sidebar navigation clicked:", page);
    console.log("onNavigate function exists:", !!onNavigate);
    
    if (onNavigate) {
      onNavigate(page);
    } else {
      console.error("Navigation function not passed to Sidebar");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };
  
  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };
  
  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
    logout();
  };

  useEffect(() => {
    // Update indicator position based on active item
    const updateIndicator = () => {
      const activeItem = document.getElementById(`sidebar-item-${activePage}`);
      if (activeItem) {
        const rect = activeItem.getBoundingClientRect();
        const parentRect = activeItem.parentElement?.parentElement?.getBoundingClientRect() || { top: 0 };
        
        setIndicatorStyle({
          display: 'block',
          left: 0,
          top: rect.top - parentRect.top,
          height: rect.height
        });
      }
    };
    
    // Initial update
    updateIndicator();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activePage]);

  // Log current active page for debugging
  useEffect(() => {
    console.log("Sidebar current active page:", activePage);
  }, [activePage]);

  return (
    <div className={`w-60 h-full flex flex-col overflow-hidden relative border-r-2 border-gray-50 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      {/* Indicator that moves with the active item */}
      <div 
        className="absolute left-0 w-1.5 bg-indigo-500 transition-all duration-200 rounded-r"
        style={indicatorStyle}
      />
      
      {/* Logo */}
      <div className="px-6 py-8">
        <BrandLogo size={50} textSize="text-md" />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-2">
        <SidebarItem 
          id="sidebar-item-dashboard"
          icon={<DashboardIcon color={activePage === 'dashboard' ? 'white' : isDark ? '#9ca3af' : '#374151'} />}
          label="Dashboard"
          active={activePage === 'dashboard'}
          onClick={() => handleNavigate('dashboard')}
        />
        <SidebarItem 
          id="sidebar-item-users"
          icon={<UsersIcon color={activePage === 'users' ? 'white' : isDark ? '#9ca3af' : '#374151'} />}
          label="Users"
          active={activePage === 'users'}
          onClick={() => handleNavigate('users')}
        />
        <SidebarItem 
          id="sidebar-item-floodwatch"
          icon={<FloodWatchIcon color={activePage === 'floodwatch' ? 'white' : isDark ? '#9ca3af' : '#374151'} />}
          label="FloodWatch"
          active={activePage === 'floodwatch'}
          onClick={() => handleNavigate('floodwatch')}
        />
        <SidebarItem 
          id="sidebar-item-evacuation"
          icon={<EvacuationCenterIcon color={activePage === 'evacuation' ? 'white' : isDark ? '#9ca3af' : '#374151'} />}
          label="Evacuation Centers"
          active={activePage === 'evacuation'}
          onClick={() => handleNavigate('evacuation')}
        />
        <SidebarItem 
          id="sidebar-item-roads"
          icon={<MapIcon className={`w-5 h-5 ${activePage === 'roads' ? 'text-white' : (isDark ? 'text-gray-400' : 'text-gray-600')}`} />}
          label="Closed Roads"
          active={activePage === 'roads'}
          onClick={() => handleNavigate('roads')}
        />
      </div>

      {/* Logout Button */}
      <div className={`mt-auto ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <SidebarItem 
          id="sidebar-item-logout"
          icon={<LogoutIcon color={isDark ? '#9ca3af' : '#374151'} />}
          label="Logout"
          onClick={handleLogoutClick}
        />
      </div>
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default Sidebar; 