"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail, Bell } from "lucide-react"

interface NotificationsTabProps {
  theme: string
}

export default function NotificationsTab({ theme }: NotificationsTabProps) {
  const { t } = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-lg bg-[#1F283B] border border-[#2A3549]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Mail className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
            <Label
              htmlFor="email-notifications"
              className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("settings.notifications.emailNotifications")}
            </Label>
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {t("settings.notifications.emailNotificationsDescription")}
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
          className="data-[state=unchecked]:bg-white data-[state=checked]:bg-[#1DAFC9]"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-[#1F283B] border border-[#2A3549]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Bell className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
            <Label
              htmlFor="marketing-emails"
              className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("settings.notifications.marketingEmails")}
            </Label>
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {t("settings.notifications.marketingEmailsDescription")}
          </p>
        </div>
        <Switch
          id="marketing-emails"
          checked={marketingEmails}
          onCheckedChange={setMarketingEmails}
          className="data-[state=unchecked]:bg-white data-[state=checked]:bg-[#1DAFC9]"
        />
      </div>
    </div>
  )
}

