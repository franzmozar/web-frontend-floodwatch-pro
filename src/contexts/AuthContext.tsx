import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import FloodWatchApiService, { User } from '../services/floodwatch-api.service';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

// AuthProvider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth-token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          const response = await FloodWatchApiService.getUserProfile();
          setUser(response.data.data);
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('auth-token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await FloodWatchApiService.login({ email, password });
      const { user, token } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('auth-token', token);
      
      // Update state
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await FloodWatchApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API success
      localStorage.removeItem('auth-token');
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Compute whether user is authenticated
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 