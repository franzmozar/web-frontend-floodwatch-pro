import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/auth.service';

// Sample credentials for quick testing
const SAMPLE_CREDENTIALS = [
  { email: 'user1', password: '12345', type: 'registration' },
  { email: 'frans_admin', password: '123', type: 'login' }
];

const LoginTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ email, password });
      setResult(response);
      console.log('Login successful:', response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerUser({ email, password });
      setResult(response);
      console.log('Registration successful:', response);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleCredentials = (sampleEmail: string, samplePassword: string) => {
    setEmail(sampleEmail);
    setPassword(samplePassword);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Web Login API Test</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">API Endpoint Information</h3>
        <p className="text-xs text-blue-700 mb-1">
          <span className="font-semibold">Registration:</span> /web/addlogin - Adds login credentials to the database
        </p>
        <p className="text-xs text-blue-700">
          <span className="font-semibold">Login:</span> /web/login - Gets login credentials from the database
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Quick Fill Sample Credentials</h3>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_CREDENTIALS.map((cred, index) => (
            <button 
              key={index}
              onClick={() => fillSampleCredentials(cred.email, cred.password)}
              className={`text-xs px-3 py-1 rounded-full ${
                cred.type === 'login' 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {cred.email} / {cred.password} ({cred.type})
            </button>
          ))}
        </div>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email/Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter email or username"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter password"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Loading...' : 'Test Login'}
          </button>
          
          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {isLoading ? 'Loading...' : 'Test Registration'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Response:</p>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LoginTest; 