import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TestingPage from './pages/TestingPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { useState } from 'react';

function AppContent() {
  const { isAuthenticated, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'main' | 'testing'>('main');

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

  // Navigate to testing page
  const goToTesting = () => {
    setCurrentPage('testing');
  };

  // Navigate to main app
  const goToMainApp = () => {
    setCurrentPage('main');
  };

  // Show the testing page
  if (currentPage === 'testing') {
    return (
      <div>
        <TestingPage />
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={goToMainApp}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Return to App
          </button>
        </div>
      </div>
    );
  }

  // Show the main app
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <DashboardPage onLogout={handleLogout} />
          <div className="fixed bottom-4 right-4 flex space-x-2">
            <button 
              onClick={goToTesting}
              className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            >
              Testing Suite
            </button>
          </div>
        </div>
      ) : (
        <div>
          <LoginPage onLoginSuccess={handleLogin} />
          <div className="fixed bottom-4 right-4">
            <button 
              onClick={goToTesting}
              className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            >
              Testing Suite
            </button>
          </div>
        </div>
      )}
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
