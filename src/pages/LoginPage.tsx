import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import OTPInput from '../components/auth/OTPInput';
import ThemeToggle from '../components/ui/ThemeToggle';
import BrandLogo from '../components/ui/BrandLogo';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showOTP, setShowOTP] = useState(false);

  // Function to be passed to LoginForm to trigger OTP screen
  const handleLoginSubmit = () => {
    setShowOTP(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form or OTP input */}
      <div className={`w-full md:w-1/2 flex items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <ThemeToggle />
        <div className="w-full max-w-md mx-auto px-12 py-8">
          {showOTP ? (
            <OTPInput />
          ) : (
            <LoginForm onSubmit={handleLoginSubmit} />
          )}
        </div>
      </div>

      {/* Right side - Gradient background with logo */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-400 items-center justify-center p-12">
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl p-6 shadow-lg max-w-xs`}>
          <BrandLogo size={100} textSize="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 