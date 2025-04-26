import { useState } from 'react';
import AddTestComponent from '../components/test/AddTestComponent';
import PhoneLoginTest from '../components/test/PhoneLoginTest';
import TestDataGenerator from '../components/test/TestDataGenerator';

type TestTab = 'basic' | 'phone' | 'flood';

const TestingPage = () => {
  const [activeTestTab, setActiveTestTab] = useState<TestTab>('basic');
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold mb-2">FloodWatch Pro - Testing Suite</h1>
        <p className="text-blue-100">
          Use this suite to test API endpoints and functionality without affecting production data.
        </p>
      </div>
      
      {/* Test type tabs */}
      <div className="mb-6 flex border-b">
        <button
          onClick={() => setActiveTestTab('basic')}
          className={`px-6 py-3 ${activeTestTab === 'basic' 
            ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Basic API Test
        </button>
        <button
          onClick={() => setActiveTestTab('phone')}
          className={`px-6 py-3 ${activeTestTab === 'phone' 
            ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Phone Login Test
        </button>
        <button
          onClick={() => setActiveTestTab('flood')}
          className={`px-6 py-3 ${activeTestTab === 'flood' 
            ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Flood Data Test
        </button>
      </div>
      
      {/* Show active test component */}
      <div className="mb-8">
        {activeTestTab === 'basic' ? <AddTestComponent /> : 
         activeTestTab === 'phone' ? <PhoneLoginTest /> : 
         <TestDataGenerator />}
      </div>
      
      {/* API connection info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">API Connection Info</h3>
        <p className="text-sm text-gray-700">
          {isDevelopment ? (
            <>
              Connected via <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">proxy</span> to: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">{import.meta.env.VITE_API_URL || 'http://192.168.1.104/ens-mobile-app-backend/public'}</span>
            </>
          ) : (
            <>
              Connected directly to: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">{import.meta.env.VITE_API_URL || 'http://192.168.1.104/ens-mobile-app-backend/public'}</span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Test data is being sent using the same format as the mobile app.
        </p>
        {isDevelopment && (
          <p className="text-xs text-blue-600 mt-1">
            Using Vite development proxy to avoid CORS issues.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestingPage; 