import axios, { AxiosInstance, AxiosError } from 'axios';

// Define the base URL for the API
// For development, we'll use the proxy configured in vite.config.ts
// For production, use the actual backend URL
const isDevelopment = import.meta.env.DEV;
// Empty string to use the proxy in both development and production Docker
const API_BASE_URL = ''; 

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': '1.0.0',
    'X-App-Platform': 'web',
  }
});

// Add request interceptor to handle authentication and log requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage instead of AsyncStorage since this is a web app
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add custom headers for tracking or debugging
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Log outgoing requests in development mode with detailed info
    if (import.meta.env.DEV) {
      console.log('%c API Request:', 'color: #3498db; font-weight: bold', {
        url: config.url,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        data: config.data,
        baseURL: config.baseURL || API_BASE_URL
      });
    }
    
    return config;
  },
  (error) => {
    console.error('%c Request Error:', 'color: #e74c3c; font-weight: bold', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development mode
    if (import.meta.env.DEV) {
      console.log('%c API Success:', 'color: #2ecc71; font-weight: bold', {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development mode with enhanced details
    if (import.meta.env.DEV) {
      try {
        console.group('%c API Error Details', 'color: #e74c3c; font-weight: bold; font-size: 14px');
        
        // Log the error object and message
        console.error('Error:', error.message);
        
        // Request details
        console.log('%c Request:', 'color: #f39c12; font-weight: bold', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method?.toUpperCase(),
          headers: error.config?.headers,
          data: error.config?.data ? JSON.parse(JSON.stringify(error.config.data)) : undefined,
          params: error.config?.params
        });
        
        // Response details if available
        if (error.response) {
          console.log('%c Response:', 'color: #e67e22; font-weight: bold', {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('%c No Response Received:', 'color: #9b59b6; font-weight: bold', error.request);
        }
        
        console.log('%c Complete Error Object:', 'color: #7f8c8d', error);
        console.groupEnd();
      } catch (loggingError) {
        console.error('Error while logging API error:', loggingError);
        console.error('Original error:', error.message);
      }
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('auth-token');
      // We're in a service, so we can't directly redirect
      // Instead, dispatch an event for the app to handle
      window.dispatchEvent(new CustomEvent('auth-error', { detail: error.response }));
    }

    return Promise.reject(error);
  }
);

// Add a method to set/update custom headers
const setCustomHeader = (key: string, value: string): void => {
  api.defaults.headers.common[key] = value;
};

// Add a method to clear a custom header
const clearCustomHeader = (key: string): void => {
  delete api.defaults.headers.common[key];
};

// Export the API instance and helper methods
export default api;
export { setCustomHeader, clearCustomHeader }; 