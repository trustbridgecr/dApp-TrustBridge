"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("Register attempt with:", { name, email, password });
    setError("Error registering. Please try again.");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Register</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Create a new blockchain microloans account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white dark:bg-[#18181B] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white dark:bg-[#18181B] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-gray-700 dark:text-gray-300" onClick={onSwitchToLogin}>
          Already have an account? Log in here
        </Button>
      </CardFooter>
    </Card>
  );
}
