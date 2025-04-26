import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import FloodWatchPage from './pages/FloodWatchPage';
import TestingPage from './pages/TestingPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { useState, useCallback, useEffect } from 'react';

type NavPage = 'dashboard' | 'users' | 'floodwatch';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'main' | 'testing'>('main');
  const [activePage, setActivePage] = useState<NavPage>('dashboard');

  // Load active page from localStorage on initial render
  useEffect(() => {
    const savedPage = localStorage.getItem('activePage') as NavPage | null;
    if (savedPage && ['dashboard', 'users', 'floodwatch'].includes(savedPage)) {
      setActivePage(savedPage);
    }
  }, []);

  // Function to handle successful login (dummy)
  const handleLoginSuccess = () => {
    // This will be called from LoginPage component
    // Authentication state will be set in the LoginPage/LoginForm
    // No need to do anything here as state is already updated
    console.log("Login success handled in App component");
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

  // Handle navigation between pages - using useCallback to ensure stability
  const handleNavigation = useCallback((page: NavPage) => {
    console.log("App: handleNavigation called with:", page);
    setActivePage(page);
    // Save active page to localStorage
    localStorage.setItem('activePage', page);
  }, []);

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

  // Show the main app with conditional rendering for pages
  return (
    <div>
      {isAuthenticated ? (
        <div>
          {activePage === 'dashboard' && (
            <DashboardPage 
              onLogout={handleLogout} 
              onNavigate={handleNavigation} 
            />
          )}
          
          {activePage === 'users' && (
            <UsersPage 
              onLogout={handleLogout} 
              onNavigate={handleNavigation} 
            />
          )}
          
          {activePage === 'floodwatch' && (
            <FloodWatchPage 
              onLogout={handleLogout} 
              onNavigate={handleNavigation} 
            />
          )}
          
          <div className="fixed bottom-4 right-4 flex space-x-2">
            <div className="flex space-x-2 mr-4">
              <button 
                onClick={() => handleNavigation('dashboard')}
                className={`px-4 py-2 ${activePage === 'dashboard' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavigation('users')}
                className={`px-4 py-2 ${activePage === 'users' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors`}
              >
                Users
              </button>
            </div>
            
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
          <LoginPage onLoginSuccess={handleLoginSuccess} />
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
