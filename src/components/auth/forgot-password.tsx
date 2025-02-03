"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ForgotPassword({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    console.log("Password reset requested for:", email);
    setSuccess(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">{t('auth.forgotPassword.title')}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t('auth.forgotPassword.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="mb-4 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              {t('auth.forgotPassword.successMessage')}
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{t('auth.common.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.common.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-[#18181B] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 text-white dark:bg-blue-700 hover:dark:bg-blue-800">
              {t('auth.forgotPassword.submitButton')}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-gray-700 dark:text-gray-300" onClick={onBackToLogin}>
          {t('auth.forgotPassword.backToLogin')}
        </Button>
      </CardFooter>
    </Card>
  );
}