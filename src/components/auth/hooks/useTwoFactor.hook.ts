import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.hook';

export const useTwoFactor = (email: string, onLogin: () => void) => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { verifyOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    try {
      const result = await verifyOTP(email, otp, onLogin);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during OTP verification');
    }
  };

  return {
    otp,
    setOtp,
    error,
    handleSubmit
  };
};