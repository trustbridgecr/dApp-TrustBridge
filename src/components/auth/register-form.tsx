"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card,CardContent,CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registerSchema = z.object({
  registrationType: z.enum(["web2", "web3"]),
  role: z.enum(["lender", "borrower"]),
  username: z.string().min(2, { message: "Username must be at least 2 characters long" }),
  monthlyIncome: z.string().refine((val) => !isNaN(parseFloat(val)), { message: "Monthly income must be a number" }),

  email: z.string().optional().refine((val) => val === undefined || z.string().email().safeParse(val).success, { message: "Invalid email" }),
  password: z.string().optional().refine((val) => val === undefined || val.length >= 6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string().optional(),

  walletAddress: z.string().optional().refine((val) => val === undefined || /^0x[a-fA-F0-9]{40}$/.test(val), { message: "Invalid wallet address" }),
}).refine(
  (data) => 
    (data.registrationType === "web2" 
      ? data.email && data.password && data.password === data.confirmPassword 
      : data.walletAddress),
  { message: "Missing required fields for selected registration type" }
);

type RegisterFormValues = z.infer<typeof registerSchema>;

export function EnhancedRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState<"web2" | "web3">("web2");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      registrationType: "web2",
      role: "borrower",
      username: "",
      monthlyIncome: "",
      email: "",
      password: "",
      confirmPassword: "",
      walletAddress: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Registration Data:", data);
      alert("Registration successful!");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Could not create the account. The email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>Choose your registration method and role</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="registrationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Type</FormLabel>
                  <Select 
                    onValueChange={(value: "web2" | "web3") => {
                      field.onChange(value);
                      setRegistrationType(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select registration type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="web2">Email Registration</SelectItem>
                      <SelectItem value="web3">Wallet Registration</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lender">Lender</SelectItem>
                      <SelectItem value="borrower">Borrower</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your monthly income" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {registrationType === "web2" && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm Password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {registrationType === "web3" && (
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          placeholder="0x..." 
                          {...field} 
                          className="flex-grow mr-2"
                        />
                        <Button type="button" variant="secondary" size="icon">
                          <Wallet size={16} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}