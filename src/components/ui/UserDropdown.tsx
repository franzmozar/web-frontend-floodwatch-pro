import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LogoutConfirmation from './LogoutConfirmation';

interface UserDropdownProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false); // Close the dropdown
    setShowLogoutConfirmation(true);
  };
  
  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };
  
  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="flex flex-col items-end mr-2">
          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</span>
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full flex items-center justify-center ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 py-2 rounded-md shadow-lg z-50 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <a 
            href="#profile" 
            className={`block px-4 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Your Profile
          </a>
          <a 
            href="#settings" 
            className={`block px-4 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Settings
          </a>
          <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <button 
            onClick={handleLogoutClick}
            className={`block w-full text-left px-4 py-2 text-sm ${
              isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'
            }`}
          >
            Logout
          </button>
        </div>
      )}
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default UserDropdown; 