"use client";

import { useSettingsForm } from "@/hooks/use-settings";
import { ProfileForm } from "@/components/borrewer/settings/ProfileForm";
import { AccountForm } from "@/components/borrewer/settings/AccountForm";
import { NotificationsForm } from "@/components/borrewer/settings/NotificationsForm";
import { CryptoForm } from "@/components/borrewer/settings/CryptoForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const {
    activeTab,
    setActiveTab,
    profileForm,
    accountForm,
    notificationsForm,
    cryptoForm,
    onProfileSubmit,
    onAccountSubmit,
    onNotificationsSubmit,
    onCryptoSubmit,
  } = useSettingsForm();

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-1 dark:bg-darkbg flex flex-col">
        <div className="container mx-auto py-10">
          <Card className="bg-white dark:bg-darkbg dark:border-none shadow-none">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account and configure your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <ProfileForm form={profileForm} onSubmit={onProfileSubmit} />
                </TabsContent>
                <TabsContent value="account">
                  <AccountForm form={accountForm} onSubmit={onAccountSubmit} />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationsForm
                    form={notificationsForm}
                    onSubmit={onNotificationsSubmit}
                  />
                </TabsContent>
                <TabsContent value="crypto">
                  <CryptoForm form={cryptoForm} onSubmit={onCryptoSubmit} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
