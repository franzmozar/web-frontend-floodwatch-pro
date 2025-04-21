import { useState } from 'react';
import TestApiService from '../../services/test-api.service';

/**
 * Component for testing phone login similar to the mobile app
 */
const PhoneLoginTest = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Same test parameter as the reference mobile app
      const param = {
        value: "test frontend"
      };
      
      // First send the test data like in the mobile app
      await TestApiService.addTest(param);
      
      // Then simulate a phone login
      await TestApiService.testPhoneLogin(phoneNumber);
      
      setSuccess('OTP sent successfully! Please enter the code.');
      setShowOtpInput(true);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to send OTP. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      await TestApiService.testVerifyOtp(phoneNumber, otp);
      setSuccess('OTP verified successfully! You are now logged in.');
      
      // Reset form after success
      setTimeout(() => {
        setPhoneNumber('');
        setOtp('');
        setShowOtpInput(false);
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to verify OTP. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Phone Login Test</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {!showOtpInput ? (
        <form onSubmit={handlePhoneNumberSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. +63 9123456789"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the OTP code"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowOtpInput(false)}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">API Testing Guide</h3>
        <p className="text-sm text-gray-600 mb-3">
          This component tests phone login functionality similar to the mobile app.
        </p>
        <div className="bg-gray-100 p-3 rounded">
          <code className="text-xs">
            // Example API call (same as mobile app)<br />
            TestApiService.addTest(&#123; value: "test frontend" &#125;);<br />
            <br />
            // Phone login test<br />
            TestApiService.testPhoneLogin(phoneNumber);<br />
            <br />
            // OTP verification test<br />
            TestApiService.testVerifyOtp(phoneNumber, otp);<br />
          </code>
        </div>
      </div>
    </div>
  );
};

export default PhoneLoginTest; 