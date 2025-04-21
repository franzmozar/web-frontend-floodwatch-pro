import { useState, useCallback } from 'react';

// Generic type for API calls with required params
type ApiCallRequired<T, P> = (params: P) => Promise<T>;

// Generic type for API calls with optional params
type ApiCallOptional<T, P = any> = (params?: P) => Promise<T>;

// Return type for the useApi hook
interface UseApiReturn<T, P> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with loading and error states
 * @param apiFunction The API function to call with required parameters
 * @returns Object with data, error, loading state, and execute function
 */
export function useApi<T, P>(
  apiFunction: ApiCallRequired<T, P>
): UseApiReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Execute the API call
  const execute = useCallback(
    async (params: P): Promise<T | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiFunction(params);
        setData(response);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  // Reset the hook state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
}

export default useApi; 