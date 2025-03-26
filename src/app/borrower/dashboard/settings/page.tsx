"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SettingsIcon, User, Shield, Bell } from "lucide-react"
import AccountTab from "@/components/borrewer/settings/account-tab"
import ProfileTab from "@/components/borrewer/settings/profile-tab"
import NotificationsTab from "@/components/borrewer/settings/notification-tab"
import CryptoTab from "@/components/borrewer/settings/crypto-tab"

export default function SettingsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("account")
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor

    if (theme === "dark") {
      document.body.style.backgroundColor = "#19181A"
      document.documentElement.classList.add("dark")
    } else {
      document.body.style.backgroundColor = "white"
      document.documentElement.classList.remove("dark")
    }

    return () => {
      document.body.style.backgroundColor = originalBg
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <>
      <div className="flex justify-between items-center mt-4 px-[4rem]">
        <div className="flex flex-col">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r from-[#1DAFC9] via-[#38bdf8] to-[#10b981] text-transparent bg-clip-text ${theme === "dark" ? "" : ""}`}
          >
            {t("settings.title")}
          </h1>
          <div className={`h-1 w-32 ${theme === "dark" ? "bg-[#38bdf8]" : "bg-[#0ea5e9]"} mt-2 rounded-full`}></div>
        </div>
        <Button
          variant="outline"
          className={`rounded-lg ${theme === "dark" ? "bg-[#0E1827] text-[#1DAFC9] border-[#0F2535] shadow-[0_4px_12px_rgba(1,242,160,0.15)]" : "bg-white text-[#0ea5e9] border-gray-200 shadow-md"}`}
        >
          {t("settings.accountSettings")}
        </Button>
      </div>

      <div className={`min-h-screen px-[12rem] container mx-auto py-10 ${theme === "dark" ? "bg-[#19181A]" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
        </div>

        <Card
          className={`border ${theme === "dark" ? "bg-[#0E1827] border-[#0F2535] shadow-[0_4px_12px_rgba(1,242,160,0.15)]" : "bg-white border-gray-200 shadow-md"}`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className={`h-6 w-6 ${theme === "dark" ? "text-[#1DAFC9]" : "text-[#0ea5e9]"}`} />
              <CardTitle
                className={`text-2xl bg-gradient-to-r from-[#1DAFC9] text-white bg-clip-text`}
              >
                {t("settings.title")}
              </CardTitle>
            </div>
            <CardDescription className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {t("settings.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid grid-cols-4 mb-8 ${theme === "dark" ? "bg-[#1e293b]" : "bg-gray-100"}`}>
                <TabsTrigger
                  value="account"
                  className={`flex items-center gap-2 ${activeTab === "account"
                    ? theme === "dark"
                      ? "bg-[#303B46] text-[#1DA0B8]"
                      : "bg-white text-[#1DA0B8]"
                    : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                    }`}
                >
                  <User className="h-4 w-4" />
                  {t("settings.tabs.account")}
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className={`flex items-center gap-2 ${activeTab === "profile"
                    ? theme === "dark"
                      ? "bg-[#303B46] text-[#1DA0B8]"
                      : "bg-white text-[#1DA0B8]"
                    : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                    }`}
                >
                  <User className="h-4 w-4" />
                  {t("settings.tabs.profile")}
                </TabsTrigger>
                <TabsTrigger
                  value="crypto"
                  className={`flex items-center gap-2 ${activeTab === "crypto"
                    ? theme === "dark"
                      ? "bg-[#303B46] text-[#1DA0B8]"
                      : "bg-white text-[#1DA0B8]"
                    : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                    }`}
                >
                  <Shield className="h-4 w-4" />
                  {t("settings.tabs.crypto")}
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className={`flex items-center gap-2 ${activeTab === "notifications"
                    ? theme === "dark"
                      ? "bg-[#303B46] text-[#1DA0B8]"
                      : "bg-white text-[#1DA0B8]"
                    : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                    }`}
                >
                  <Bell className="h-4 w-4" />
                  {t("settings.tabs.notifications")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <AccountTab theme={theme} />
              </TabsContent>

              <TabsContent value="profile">
                <ProfileTab theme={theme} />
              </TabsContent>

              <TabsContent value="crypto">
                <CryptoTab theme={theme} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab theme={theme} />
              </TabsContent>

              <div className="mt-8">
                <Button className="w-full bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#10b981] text-white hover:opacity-90">
                  {t("settings.saveButton")}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className={`fixed inset-0 -z-10 ${theme === "dark" ? "bg-[#19181A]" : "bg-white"}`}></div>
      </div>
    </>
  )
}

