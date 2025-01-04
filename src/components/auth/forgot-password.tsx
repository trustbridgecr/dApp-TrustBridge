"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ForgotPassword({ onBackToLogin }: { onBackToLogin: () => void }) {
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
        <CardTitle className="text-gray-900 dark:text-gray-100">Reset Password</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter your email address to receive reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="mb-4 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Reset instructions have been sent to your email address.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
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
              Send Instructions
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-gray-700 dark:text-gray-300" onClick={onBackToLogin}>
          Back to login
        </Button>
      </CardFooter>
    </Card>
  );
}
