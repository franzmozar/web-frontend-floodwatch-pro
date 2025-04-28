import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import LoginForm from '../components/auth/LoginForm';
import ThemeToggle from '../components/ui/ThemeToggle';
import BrandLogo from '../components/ui/BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import usePageTitle from '../hooks/usePageTitle';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Set the page title
  usePageTitle('Login');

  // Function to handle login form submission
  const handleLoginSubmit = () => {
    // Call the parent component's onLoginSuccess if provided
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <>
      <div className="flex min-h-screen relative">
        {/* Theme Toggle Button (positioned in the top-right corner) */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Left side - Login form */}
        <div className={`w-full md:w-1/2 flex items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="w-full max-w-md mx-auto px-12 py-8">
            <LoginForm onSubmit={handleLoginSubmit} />
          </div>
        </div>

        {/* Right side - Gradient background with logo */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-400 items-center justify-center p-12">
          <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl p-6 shadow-lg max-w-xs`}>
            <BrandLogo size={100} textSize="text-xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 