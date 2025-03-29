import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.hook';

export const useTwoFactor = (email: string, onLogin: () => void) => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { verifyOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(email, otp, onLogin);

      if (result.success) {
        setOtp('');
      } else {
        setError(result.error || 'Invalid OTP');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during OTP verification');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    error,
    isLoading,
    handleSubmit
  };
};