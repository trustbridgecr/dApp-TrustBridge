"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, CreditCard, DollarSign, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CryptoTabProps {
  theme: string
}

export default function CryptoTab({ theme }: CryptoTabProps) {
  const { t } = useTranslation()
  const [walletAddress, setWalletAddress] = useState("0xf3B1E8F0A1D9B2c988F42817bB935378285a9d8")
  const [currency, setCurrency] = useState("ethereum")
  const [autoConvert, setAutoConvert] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Wallet className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="wallet-address" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.crypto.walletAddress")}
          </Label>
        </div>
        <div className="flex">
          <Input
            id="wallet-address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className={`rounded-r-none ${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className={`rounded-l-none border-l-0 ${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white hover:bg-[#2d3748] hover:text-gray-300" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
          {t("settings.crypto.walletAddressDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CreditCard className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
          <Label htmlFor="currency" className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {t("settings.crypto.preferredCurrency")}
          </Label>
        </div>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger
            className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <SelectValue placeholder={t("settings.crypto.selectCurrency")} />
          </SelectTrigger>
          <SelectContent
            className={`${theme === "dark" ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
            <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
            <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
          </SelectContent>
        </Select>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {t("settings.crypto.currencyDescription")}
        </p>
      </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1F283B] border border-[#2A3549]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <DollarSign className={`h-5 w-5 ${theme === "dark" ? "text-[#1DAFC9]" : "text-gray-500"}`} />
            <Label
              htmlFor="auto-convert"
              className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("settings.crypto.autoConvert")}
            </Label>
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {t("settings.crypto.autoConvertDescription")}
          </p>
        </div>
        <Switch
          id="auto-convert"
          checked={autoConvert}
          onCheckedChange={setAutoConvert}
          className={theme === "dark" ? "data-[state=checked]:bg-[#38bdf8]" : "data-[state=checked]:bg-[#0ea5e9]"}
        />
      </div>
    </div>
  )
}

