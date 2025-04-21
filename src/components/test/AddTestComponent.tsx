import { useState } from 'react';
import TestApiService from '../../services/test-api.service';
import api from '../../services/api.service';

/**
 * Component for testing the basic addTest API endpoint
 * This matches the mobile app's test functionality
 */
const AddTestComponent = () => {
  const [value, setValue] = useState('test frontend');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorDetails(null);
    setResult(null);
    setLoading(true);
    
    try {
      // Call the addTest endpoint with the value
      const response = await TestApiService.addTest({ value });
      setResult(response.data || { message: 'Test data sent successfully' });
    } catch (err: any) {
      // Handle enhanced error format or string errors
      if (typeof err === 'object' && err.message) {
        setError(err.message);
        setErrorDetails(err.originalError || err);
      } else {
        setError(typeof err === 'string' ? err : 'Failed to send test data. Please try again.');
      }
      console.error('API Error Caught in Component:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Get info about environment
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment 
    ? window.location.origin  // Using proxy in development
    : (api.defaults.baseURL || 'API URL not set');
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Basic API Test</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline font-medium">{error}</span>
          
          {errorDetails && (
            <div className="mt-2">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium">Show Error Details</summary>
                <div className="mt-2 overflow-auto max-h-40 bg-red-50 p-2 rounded">
                  {errorDetails.config && (
                    <div className="mb-2">
                      <div><strong>URL:</strong> {errorDetails.config.url}</div>
                      <div><strong>Method:</strong> {errorDetails.config.method?.toUpperCase()}</div>
                      <div><strong>Data:</strong> {JSON.stringify(errorDetails.config.data)}</div>
                    </div>
                  )}
                  {errorDetails.response && (
                    <div className="mb-2">
                      <div><strong>Status:</strong> {errorDetails.response.status} {errorDetails.response.statusText}</div>
                      <div><strong>Response:</strong> {JSON.stringify(errorDetails.response.data)}</div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">Success!</span>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. test frontend"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Test Data'}
        </button>
      </form>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">API Testing Guide</h3>
        <p className="text-sm text-gray-600 mb-3">
          This component tests the basic addTest functionality that matches the mobile app's test feature.
        </p>
        <div className="bg-gray-100 p-3 rounded">
          <code className="text-xs">
            // Example API call (same as mobile app)<br />
            TestApiService.addTest(&#123; value: "test frontend" &#125;);<br />
            <br />
            // Environment: {isDevelopment ? 'Development (using proxy)' : 'Production'}<br />
            // Endpoint URL:<br />
            {isDevelopment 
              ? `${window.location.origin}/sample/addtest (proxied to backend)` 
              : `${baseUrl}/sample/addtest`}
          </code>
        </div>
      </div>
    </div>
  );
};

export default AddTestComponent; 