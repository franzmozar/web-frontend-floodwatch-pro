import { useState } from 'react';
import TestApiService from '../../services/test-api.service';
import useApi from '../../hooks/useApi';
import { TestFloodData, generateMultipleFloodData } from '../../utils/api-utils';

/**
 * Component for generating test data and testing API functionality
 */
const TestDataGenerator = () => {
  // State for form inputs
  const [location, setLocation] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [batchSize, setBatchSize] = useState('5');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<{success: number, failed: number} | null>(null);
  
  // Use our custom API hook with the explicitly typed function
  const { loading, error, data, execute } = useApi<any, TestFloodData>(
    (data: TestFloodData) => TestApiService.addFloodData(data)
  );
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const floodData: TestFloodData = {
      location,
      water_level: parseFloat(waterLevel),
      risk_level: riskLevel,
      coordinates: latitude && longitude ? {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      } : undefined
    };
    
    await execute(floodData);
  };
  
  // Handle batch data generation
  const handleBatchGenerate = async () => {
    setBatchLoading(true);
    setBatchResult(null);
    
    try {
      // Generate the specified number of random flood data items
      const size = parseInt(batchSize, 10);
      const batchData = generateMultipleFloodData(size);
      
      // Process batch
      let successCount = 0;
      let failCount = 0;
      
      for (const data of batchData) {
        try {
          await TestApiService.addFloodData(data);
          successCount++;
        } catch (err) {
          console.error('Failed to add data item:', err);
          failCount++;
        }
      }
      
      setBatchResult({
        success: successCount,
        failed: failCount
      });
    } catch (err) {
      console.error('Batch generation error:', err);
    } finally {
      setBatchLoading(false);
    }
  };
  
  // Handle resetting test data
  const handleReset = async () => {
    try {
      await TestApiService.resetTestData();
      alert('Test data has been reset successfully');
      setBatchResult(null);
    } catch (err) {
      alert('Failed to reset test data');
      console.error(err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Data Generator</h2>
      
      <div className="flex mb-4 space-x-2">
        <button
          type="button"
          onClick={() => setShowBatchForm(false)}
          className={`px-4 py-2 text-sm rounded-md ${!showBatchForm ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Single Record
        </button>
        <button
          type="button"
          onClick={() => setShowBatchForm(true)}
          className={`px-4 py-2 text-sm rounded-md ${showBatchForm ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Batch Records
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">Data added successfully!</span>
        </div>
      )}
      
      {batchResult && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">
            Batch processing completed: {batchResult.success} successful, {batchResult.failed} failed
          </span>
        </div>
      )}
      
      {!showBatchForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. North Junction"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Water Level (meters)</label>
            <input
              type="number"
              step="0.01"
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 1.75"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude (optional)</label>
              <input
                type="number"
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 14.5995"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude (optional)</label>
              <input
                type="number"
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 120.9842"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Test Data'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Test Data
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Records to Generate</label>
            <input
              type="number"
              min="1"
              max="50"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 5"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleBatchGenerate}
              disabled={batchLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {batchLoading ? 'Generating...' : 'Generate Batch Data'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Test Data
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">API Testing Guide</h3>
        <p className="text-sm text-gray-600 mb-3">
          This component demonstrates how to use the TestApiService to add test data to your backend.
        </p>
        <div className="bg-gray-100 p-3 rounded">
          <code className="text-xs">
            // Example API call<br />
            TestApiService.addFloodData(&#123;<br />
            &nbsp;&nbsp;location: 'Test Location',<br />
            &nbsp;&nbsp;water_level: 2.5,<br />
            &nbsp;&nbsp;risk_level: 'medium'<br />
            &#125;);<br />
          </code>
        </div>
      </div>
    </div>
  );
};

export default TestDataGenerator; 