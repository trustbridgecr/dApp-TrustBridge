"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, FileText } from "lucide-react"

interface ProfileTabProps {
  theme: string
}

export default function ProfileTab({ theme }: ProfileTabProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState("john.doe@example.com")
  const [bio, setBio] = useState("I'm a tech enthusiast interested in blockchain and decentralized finance.")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="email" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.profile.emailAddress")}
          </Label>
        </div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
        />
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {t("settings.profile.emailDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="bio" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.profile.bio")}
          </Label>
        </div>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`min-h-[120px] ${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
        />
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {t("settings.profile.bioDescription")}
        </p>
      </div>
    </div>
  )
}

