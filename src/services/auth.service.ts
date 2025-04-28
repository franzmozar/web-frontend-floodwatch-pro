import api from './api.service';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  token?: string;
  user?: any;
}

/**
 * Register a new user
 * @param credentials User credentials (email & password)
 * @returns Promise with the response
 */
export const registerUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post('/web/addlogin', credentials);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Authenticate user with credentials
 * @param credentials User credentials (email & password) 
 * @returns Promise with the login response
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with credentials:', JSON.stringify({
      email: credentials.email,
      passwordProvided: !!credentials.password
    }));
    
    console.log('Login endpoint URL:', '/web/login');
    
    const response = await api.post('/web/login', credentials);
    console.log('Login response received:', response.status);
    
    // If login successful, store the token
    if (response.data.token) {
      localStorage.setItem('auth-token', response.data.token);
      console.log('Token stored successfully');
    }
    
    return response.data;
  } catch (error: any) {
    // Enhanced error logging
    console.error('Login failed with error:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
      console.error('Request details:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = (): void => {
  localStorage.removeItem('auth-token');
  // Could also call an API endpoint for server-side logout if needed
};

/**
 * Check if user is currently authenticated
 * @returns boolean indicating if user has a token
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth-token');
}; 