import api from './api.service';

/**
 * Test API Service
 * Used for testing database operations
 */
const TestApiService = {
  /**
   * Add test data to the database - matches the reference mobile app
   * @param data Simple test data with a value property
   */
  addTest: (data: { value: string }) => api.post('/sample/addtest', data),
  
  /**
   * Test phone login - similar to mobile app
   * @param phoneNumber The phone number to test
   */
  testPhoneLogin: (phoneNumber: string) => api.post('/api/test/phone-login', { phoneNumber }),
  
  /**
   * Test OTP verification - similar to mobile app
   * @param phoneNumber The phone number
   * @param otp The OTP code
   */
  testVerifyOtp: (phoneNumber: string, otp: string) => 
    api.post('/api/test/verify-otp', { phoneNumber, otp }),
  
  /**
   * Add dummy flood data for testing
   * @param data Flood data to add
   */
  addFloodData: (data: { 
    location: string; 
    water_level: number; 
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    coordinates?: { lat: number; lng: number } 
  }) => api.post('/api/test/add-flood-data', data),
  
  /**
   * Add dummy user for testing
   * @param userData User data to add
   */
  addUser: (userData: { 
    name: string; 
    email: string; 
    role?: string;
    password?: string;
  }) => api.post('/api/test/add-user', userData),
  
  /**
   * Add dummy alert settings for testing
   * @param settings Alert settings to add
   */
  addAlertSettings: (settings: {
    user_id: number;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    push_notifications?: boolean;
    risk_threshold?: string;
  }) => api.post('/api/test/add-alert-settings', settings),
  
  /**
   * Get all test flood data
   */
  getAllFloodData: () => api.get('/api/test/flood-data'),
  
  /**
   * Get all test users
   */
  getAllUsers: () => api.get('/api/test/users'),
  
  /**
   * Get all test alert settings
   */
  getAllAlertSettings: () => api.get('/api/test/alert-settings'),
  
  /**
   * Update an existing flood data record
   */
  updateFloodData: (id: number, data: any) => api.post(`/api/test/update-flood-data/${id}`, data),
  
  /**
   * Delete a flood data record
   */
  deleteFloodData: (id: number) => api.post(`/api/test/delete-flood-data/${id}`, {}),
  
  /**
   * Reset test database
   */
  resetTestData: () => api.post('/api/test/reset', {}),
  
  /**
   * Generic POST method for test endpoint
   */
  post: (endpoint: string, data: any) => api.post(`/api/test${endpoint}`, data),
  
  /**
   * Generic GET method for test endpoint
   */
  get: (endpoint: string, params?: any) => api.get(`/api/test${endpoint}`, { params })
};

export default TestApiService; 