import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSubmit?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { login } = useAuth();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for a more realistic feel
    setTimeout(() => {
      // Directly call onSubmit to go to dashboard, bypassing actual login
      if (onSubmit) {
        onSubmit();
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="w-full">
      <div className="text-left mb-8">
        <h2 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin Login</h2>
        <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Welcome Back</p>
        <p className={`mt-2 text-sm ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
          Dummy credentials are pre-filled. Just click Login.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
            required
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
            required
          />
        </div>

        <Button 
          type="submit" 
          className={`rounded-full mt-4 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          isLoading={isLoading}
        >
          Login
        </Button>

        <div className="text-center mt-4">
          <a 
            href="#" 
            className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Forgot Password
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 