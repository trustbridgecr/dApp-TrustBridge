'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function ForbiddenPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const handleRedirect = () => {
    if (user?.role === 'Lender') {
      router.push('/lender/dashboard');
    } else if (user?.role === 'Borrower') {
      router.push('/borrower/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background p-4 ${theme === "dark" ? "dark" : ""}`}>
      <Card className="max-w-md w-full bg-white dark:bg-[#18181B] border-none shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-red-600 dark:text-red-500">403</CardTitle>
          <CardDescription className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('error.forbidden.title', 'Access Denied')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t('error.forbidden.description', 'You do not have permission to access this page. Please check your role and permissions.')}
          </p>
          <Button
            onClick={handleRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {t('error.forbidden.backButton', 'Back')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 