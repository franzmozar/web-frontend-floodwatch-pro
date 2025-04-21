import api from './api.service';

// Define types for API responses
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Define common data types that might be used across the app
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface FloodData {
  id: number;
  location: string;
  water_level: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AlertSettings {
  id: number;
  user_id: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  risk_threshold: string;
}

// Create the API service with typed methods
const FloodWatchApiService = {
  // Authentication endpoints
  login: (credentials: { email: string; password: string }) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => 
    api.post<ApiResponse<User>>('/auth/register', userData),
  
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  
  // User profile endpoints
  getUserProfile: () => api.get<ApiResponse<User>>('/user/profile'),
  
  updateUserProfile: (data: Partial<User>) => api.post<ApiResponse<User>>('/user/profile', data),
  
  // Flood data endpoints
  getFloodData: (params?: { location?: string; risk_level?: string }) => 
    api.get<ApiResponse<FloodData[]>>('/flood-data', { params }),
  
  getFloodDataById: (id: number) => api.get<ApiResponse<FloodData>>(`/flood-data/${id}`),
  
  // Alert settings endpoints
  getAlertSettings: () => api.get<ApiResponse<AlertSettings>>('/alerts/settings'),
  
  updateAlertSettings: (settings: Partial<AlertSettings>) => 
    api.post<ApiResponse<AlertSettings>>('/alerts/settings', settings),
  
  // Generic methods for custom endpoints
  get: <T = any>(endpoint: string, params?: any) => api.get<T>(endpoint, { params }),
  
  post: <T = any>(endpoint: string, data: any) => api.post<T>(endpoint, data),
  
  postFile: <T = any>(endpoint: string, formData: FormData) => {
    return api.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default FloodWatchApiService; 