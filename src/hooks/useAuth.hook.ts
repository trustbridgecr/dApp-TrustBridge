import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { VERIFY_OTP } from '@/graphql/mutations';

export const useAuth = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [is2FARequired, setIs2FARequired] = useState<boolean>(false);

  const [verifyOTPMutation] = useMutation(VERIFY_OTP);

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

    // simulate delay
    //  await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const { data } = await verifyOTPMutation({ variables: { email, otp } });
      onLogin();
      return { success: true, data };
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred";

      if (err?.graphQLErrors?.length) {
        errorMessage = err.graphQLErrors[0].message || errorMessage;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    login,
    verifyOTP,
    error,
    is2FARequired,
  };
};
