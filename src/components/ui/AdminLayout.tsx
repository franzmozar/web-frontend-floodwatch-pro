import React, { ReactNode, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';
import ThemeToggle from './ThemeToggle';
import { NavPage } from '../../types/common';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  currentUser?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  activePage?: NavPage;
  onNavigate?: (page: NavPage) => void;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = 'Dashboard',
  currentUser = { name: 'Admin User', role: 'Admin' },
  activePage = 'dashboard',
  onNavigate,
  onLogout
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Debug logs for props
  useEffect(() => {
    console.log("AdminLayout: Active Page =", activePage);
    console.log("AdminLayout: Navigation function exists =", !!onNavigate);
  }, [activePage, onNavigate]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality here
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`flex items-center justify-between px-4 py-3 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-b border-gray-100'
        } shadow-sm`}>
          {/* Search Bar */}
          <div className="w-full max-w-md">
            <SearchBar onSearch={handleSearch} placeholder="Search" />
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <div className="mr-8">
              <ThemeToggle />
            </div>
            <UserDropdown user={currentUser} onLogout={onLogout} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`px-6 py-9 flex-1 overflow-auto ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {/* Page Title */}
          <div className={` ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h1>
          </div>
          
          {/* Page Content */}
          <div className="mt-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 