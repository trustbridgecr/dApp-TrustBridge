import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [is2FARequired, setIs2FARequired] = useState<boolean>(false);

  const login = async (email: string, password: string, onLogin: () => void) => {
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('auth.login.failedMessage'));
      }

      if (data.is2FARequired) {
        setIs2FARequired(true);
        return { is2FARequired: true };
      } else {
        onLogin();
        return { is2FARequired: false };
      }
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const verifyOTP = async (email: string, otp: string, onLogin: () => void) => {
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('auth.otp.invalidMessage'));
      }

      onLogin();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    }
  };

  return {
    login,
    verifyOTP,
    error,
    is2FARequired,
  };
};