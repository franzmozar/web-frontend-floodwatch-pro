import { AxiosError } from 'axios';
import TestApiService from '../services/test-api.service';
// Prefixing with underscore to indicate intentional non-use for now
interface _OriginalFloodData {
  // ... existing code ...
}

// Define a modified FloodData type for test data generation
// that makes id and timestamp optional
export interface TestFloodData {
  id?: number;
  location: string;
  water_level: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Utility to extract error message from API error
 * @param error The error object from an API call
 * @returns A readable error message string
 */
export const extractErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message;
  }
  
  // Handle case when error.response exists but isn't coming from AxiosError
  if (error.response?.data) {
    if (error.response.data.message) return error.response.data.message;
    if (error.response.data.error) return error.response.data.error;
  }
  
  return typeof error === 'string' ? error : 'An unexpected error occurred';
};

/**
 * Type for batch operation item status
 */
export interface BatchOperationResult<T> {
  item: T;
  success: boolean;
  error?: string;
}

/**
 * Process a batch of API operations, returning status for each
 * @param items Array of items to process
 * @param processFn Function to process each item
 * @returns Array of operation results
 */
export const processBatch = async <T>(
  items: T[],
  processFn: (item: T) => Promise<any>
): Promise<BatchOperationResult<T>[]> => {
  const results: BatchOperationResult<T>[] = [];
  
  for (const item of items) {
    try {
      await processFn(item);
      results.push({ item, success: true });
    } catch (error) {
      results.push({
        item,
        success: false,
        error: extractErrorMessage(error)
      });
    }
  }
  
  return results;
};

/**
 * Add multiple flood data records for testing
 * @param floodDataRecords Array of flood data records
 * @returns Operation results
 */
export const addBatchFloodData = (floodDataRecords: TestFloodData[]) => {
  return processBatch(
    floodDataRecords,
    (data) => TestApiService.addFloodData(data as any)
  );
};

/**
 * Generate a random flood data sample for testing
 * @param options Optional override values
 * @returns A random flood data object
 */
export const generateRandomFloodData = (
  options: Partial<TestFloodData> = {}
): TestFloodData => {
  const locations = [
    'North Junction', 
    'East River', 
    'South Bridge', 
    'West Valley', 
    'Central District'
  ];
  
  const riskLevels: Array<TestFloodData['risk_level']> = ['low', 'medium', 'high', 'critical'];
  
  // Generate random data with defaults
  const randomData: TestFloodData = {
    location: locations[Math.floor(Math.random() * locations.length)],
    water_level: parseFloat((Math.random() * 4 + 0.3).toFixed(2)),
    risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    // Random coordinates around a central point
    coordinates: {
      lat: parseFloat((14.5995 + (Math.random() - 0.5) * 0.1).toFixed(6)),
      lng: parseFloat((120.9842 + (Math.random() - 0.5) * 0.1).toFixed(6)),
    },
    ...options
  };
  
  return randomData;
};

/**
 * Generate multiple random flood data samples for testing
 * @param count Number of samples to generate
 * @param baseOptions Optional base options to apply to all samples
 * @returns Array of random flood data objects
 */
export const generateMultipleFloodData = (
  count: number,
  baseOptions: Partial<TestFloodData> = {}
): TestFloodData[] => {
  return Array.from({ length: count }, () => 
    generateRandomFloodData(baseOptions)
  );
}; 