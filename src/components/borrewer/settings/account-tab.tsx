"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Calendar, Globe, DollarSign } from "lucide-react"

interface AccountTabProps {
  theme: string
}

export default function AccountTab({ theme }: AccountTabProps) {
  const { t } = useTranslation()
  const [fullName, setFullName] = useState("John Doe")
  const [dateOfBirth, setDateOfBirth] = useState("01/01/1990")
  const [language, setLanguage] = useState("english")
  const [income, setIncome] = useState("5000")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="fullName" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.account.fullName")}
          </Label>
        </div>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
        />
        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
          {t("settings.account.fullNameDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="dateOfBirth" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.account.dateOfBirth")}
          </Label>
        </div>
        <Input
          id="dateOfBirth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="language" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.account.language")}
          </Label>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger
            className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <SelectValue placeholder={t("settings.account.selectLanguage")} />
          </SelectTrigger>
          <SelectContent
            className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
          </SelectContent>
        </Select>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {t("settings.account.languageDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="income" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.account.monthlyIncome")}
          </Label>
        </div>
        <Input
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
        />
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {t("settings.account.incomeDescription")}
        </p>
      </div>
    </div>
  )
}

