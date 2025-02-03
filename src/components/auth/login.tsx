"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onLogin: () => void;
}

export function Login({ onSwitchToRegister, onForgotPassword, onLogin }: LoginProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt with:", { email, password });
    onLogin();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
      <CardHeader>
        <CardTitle className="text-black dark:text-gray-100">{t('auth.login.title')}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t('auth.login.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              className="bg-white dark:bg-[#18181B] text-black dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">{t('auth.common.passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white dark:bg-[#18181B] text-black dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            />
          </div>
          {error && (
            <Alert variant="destructive" className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 border dark:border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-700 text-white hover:dark:bg-blue-800"
          >
            {t('auth.login.submitButton')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Button
          variant="link"
          className="text-gray-700 dark:text-gray-400"
          onClick={onForgotPassword}
        >
          {t('auth.login.forgotPasswordLink')}
        </Button>
        <Button
          variant="link"
          className="text-gray-700 dark:text-gray-400"
          onClick={onSwitchToRegister}
        >
          {t('auth.login.registerLink')}
        </Button>
      </CardFooter>
    </Card>
  );
}
