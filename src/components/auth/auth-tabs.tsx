"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="register">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-0">
        <LoginForm onSuccess={() => setActiveTab("login")} />
      </TabsContent>
      <TabsContent value="register" className="mt-0">
        <RegisterForm onSuccess={() => setActiveTab("login")} />
      </TabsContent>
    </Tabs>
  );
}
