import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { useState } from 'react';
import TestDataGenerator from './components/test/TestDataGenerator';
import PhoneLoginTest from './components/test/PhoneLoginTest';
import AddTestComponent from './components/test/AddTestComponent';

function AppContent() {
  const { isAuthenticated, login, logout } = useAuth();
  const [showTest, setShowTest] = useState(true);
  const [activeTestTab, setActiveTestTab] = useState<'phone' | 'flood' | 'basic'>('basic');

  // Mock credentials for automatic login from the LoginPage component
  // In a real app, this would come from the login form
  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  // Function to handle successful login
  const handleLogin = () => {
    // Call login with hardcoded credentials for testing
    // In a real app, these would come from the login form
    login(mockEmail, mockPassword).catch(error => {
      console.error("Login failed:", error);
    });
  };

  // Function to handle logout
  const handleLogout = () => {
    logout().catch(error => {
      console.error("Logout failed:", error);
    });
  };

  // Toggle between test page and normal app
  const toggleTestMode = () => {
    setShowTest(!showTest);
  };

  // Show the test data generator page
  if (showTest) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FloodWatch Pro - Test Mode</h1>
          <button 
            onClick={toggleTestMode}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Go to Main App
          </button>
        </div>
        
        {/* Test type tabs */}
        <div className="mb-6 flex border-b">
          <button
            onClick={() => setActiveTestTab('basic')}
            className={`px-4 py-2 ${activeTestTab === 'basic' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Basic Test
          </button>
          <button
            onClick={() => setActiveTestTab('phone')}
            className={`px-4 py-2 ${activeTestTab === 'phone' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Phone Login Test
          </button>
          <button
            onClick={() => setActiveTestTab('flood')}
            className={`px-4 py-2 ${activeTestTab === 'flood' 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Flood Data Test
          </button>
        </div>
        
        {/* Show active test component */}
        {activeTestTab === 'basic' ? <AddTestComponent /> : 
         activeTestTab === 'phone' ? <PhoneLoginTest /> : 
         <TestDataGenerator />}
        
        {/* API connection info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-2">API Connection Info</h3>
          <p className="text-sm text-gray-700">
            {import.meta.env.DEV ? (
              <>
                Connected via <span className="font-mono">proxy</span> to: <span className="font-mono">{import.meta.env.VITE_API_URL || 'http://192.168.1.104/ens-mobile-app-backend/public'}</span>
              </>
            ) : (
              <>
                Connected directly to: <span className="font-mono">{import.meta.env.VITE_API_URL || 'http://192.168.1.104/ens-mobile-app-backend/public'}</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Test data is being sent using the same format as the mobile app.
          </p>
          {import.meta.env.DEV && (
            <p className="text-xs text-blue-600 mt-1">
              Using Vite development proxy to avoid CORS issues.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show the main app
  return (
    <div>
      {isAuthenticated ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLogin} />
      )}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={toggleTestMode}
          className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          Test Mode
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
