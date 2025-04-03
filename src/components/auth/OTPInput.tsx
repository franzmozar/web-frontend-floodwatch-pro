import React, { useRef, useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface OTPInputProps {
  onBack?: () => void;
  onSubmit?: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onBack, onSubmit }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only accept numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the OTP state
    const newOtp = [...otp];
    // Only take the last character if somehow more than one character is entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // If a digit was entered and there's a next input, focus it
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // On backspace, if input is empty, focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]!.focus();
    }
    
    // Arrow key navigation between inputs
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]!.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content contains only digits
    if (!/^\d+$/.test(pastedData)) return;
    
    // Take up to 4 characters
    const otpArray = pastedData.substring(0, 4).split('');
    
    // Fill the OTP array with the pasted digits
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(otpArray.length, 4); i++) {
      newOtp[i] = otpArray[i];
    }
    
    setOtp(newOtp);
    
    // Focus the appropriate input based on pasted length
    const focusIndex = Math.min(otpArray.length, 3);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]!.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    console.log('OTP Submitted:', otpValue);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="text-left mb-8">
        <h2 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>One-Time-Password</h2>
        <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          A message was sent to your registered mobile number
        </p>
      </div>

      <div className="flex justify-between w-full gap-2 my-8">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-full rounded-2xl aspect-square text-center text-2xl border focus:outline-none focus:border-blue-500 ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-800 border-gray-200'
            }`}
          />
        ))}
      </div>

      <Button 
        onClick={handleSubmit}
        className={`rounded-full mt-4 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        Confirm
      </Button>

      {onBack && (
        <div className="text-center mt-4">
          <button 
            onClick={onBack}
            className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ← Back to login
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPInput; 