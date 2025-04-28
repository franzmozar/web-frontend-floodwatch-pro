import api from './api.service';

// Define types for API responses
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Define User type for the API
export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Define FloodData type
export interface FloodData {
  id: number;
  location: string;
  coordinates: string;
  water_level: number;
  rainfall: number;
  risk_level: string;
  timestamp: string;
  description?: string;
}

// Define AlertSettings type
export interface AlertSettings {
  id: number;
  user_id: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  risk_threshold: string;
}

// Define EvacuationCenter type
export interface EvacuationCenter {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  descriptionImage: string;
  description: string;
}

// Define ClosedRoad type
export interface ClosedRoad {
  id: string;
  title: string;
  latitude: string;
  longitude: string;
  description: string;
}

// Create the API service with typed methods
const FloodWatchApiService = {
  // Authentication endpoints - updated to use web login endpoint
  login: (credentials: { email: string; password: string }) => 
    api.post<any>('/web/login', credentials),
  
  register: (userData: { email: string; password: string }) => 
    api.post<any>('/web/addlogin', userData),
  
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
  
  // Evacuation Center endpoints
  addEvacuationCenter: (data: Omit<EvacuationCenter, 'id'>) => 
    api.post<ApiResponse<EvacuationCenter>>('/web/addevacuationcenters', data),
  
  getEvacuationCenters: () => {
    try {
      return api.get<ApiResponse<EvacuationCenter[]>>('/web/getevacuationcenters');
    } catch (error) {
      console.error('Exception in getEvacuationCenters:', error);
      throw error;
    }
  },
  
  // Closed Roads endpoints
  addClosedRoad: (data: Omit<ClosedRoad, 'id'>) => 
    api.post<ApiResponse<ClosedRoad>>('/web/addclosedroads', data),
  
  getClosedRoads: () => {
    try {
      return api.get<ApiResponse<ClosedRoad[]>>('/web/getclosedroads');
    } catch (error) {
      console.error('Exception in getClosedRoads:', error);
      throw error;
    }
  },
  
  // Generic methods for custom endpoints
  get: <T = any>(endpoint: string, params?: any) => api.get<T>(endpoint, { params }),
  
  post: <T = any>(endpoint: string, data: any) => api.post<T>(endpoint, data),
  
  postFile: <T = any>(endpoint: string, formData: FormData) => {
    console.log(`DEBUG API: Sending file upload request to ${endpoint}`);
    
    // Log form data contents (without the actual file binary)
    const formDataEntries: {[key: string]: string} = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        formDataEntries[key] = `File: ${value.name} (${value.type}, ${value.size} bytes)`;
      } else {
        formDataEntries[key] = String(value);
      }
    });
    console.log('DEBUG API: FormData contents:', formDataEntries);
    
    return api.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log('DEBUG API: File upload response success:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return response;
    })
    .catch(error => {
      console.error('DEBUG API: File upload error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    });
  },
};

export default FloodWatchApiService; 