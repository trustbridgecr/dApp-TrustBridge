"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Lock, Mail, User, Wallet } from "lucide-react"
import Image from "next/image"

export default function Register() {
    const { t, i18n } = useTranslation()
    const [theme] = useState("dark")

    useEffect(() => {
        const originalBg = document.body.style.backgroundColor

        if (theme === "dark") {
            document.body.style.backgroundColor = "#0f172a"
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

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] p-4">
            <div className="mb-8 flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Image src="/img/TrustBridge-dark.png" width={250} height={250} alt="TrustBridge Logo" />
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="mb-4 flex justify-end">
                    <Select defaultValue={i18n.language} onValueChange={changeLanguage}>
                        <SelectTrigger className="w-[120px] bg-[#111827] border-gray-800 text-white">
                            <Globe className="mr-2 h-4 w-4 text-cyan-400" />
                            <SelectValue placeholder={t("auth.languageSelector")} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111827] border-gray-800 text-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-gray-800 bg-[#111827] shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-cyan-400">{t("auth.welcome")}</CardTitle>
                        <CardDescription className="text-gray-400">{t("auth.registerTitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-white">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-cyan-400" />
                                        {t("auth.fullName")}
                                    </div>
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder={t("auth.fullNamePlaceholder")}
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerEmail" className="text-white">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-cyan-400" />
                                        {t("auth.email")}
                                    </div>
                                </Label>
                                <Input
                                    id="registerEmail"
                                    type="email"
                                    placeholder={t("auth.emailPlaceholder")}
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerPassword" className="text-white">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-cyan-400" />
                                        {t("auth.password")}
                                    </div>
                                </Label>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    placeholder={t("auth.passwordPlaceholder")}
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-cyan-400" />
                                        {t("auth.confirmPassword")}
                                    </div>
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder={t("auth.confirmPasswordPlaceholder")}
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="walletAddress" className="text-white">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-4 w-4 text-cyan-400" />
                                        {t("auth.walletAddress")}
                                    </div>
                                </Label>
                                <Input
                                    id="walletAddress"
                                    type="text"
                                    placeholder={t("auth.walletAddressPlaceholder")}
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="text-xs text-gray-400">
                                {t("auth.termsAgree")}{" "}
                                <Link href="/terms" className="text-cyan-400 hover:underline">
                                    {t("auth.termsLink")}
                                </Link>{" "}
                                {t("auth.and")}{" "}
                                <Link href="/privacy" className="text-cyan-400 hover:underline">
                                    {t("auth.privacyLink")}
                                </Link>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90">
                                {t("auth.registerButton")}
                            </Button>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-700"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#111827] px-2 text-gray-400">or</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-[#1e293b]">
                                <Wallet className="mr-2 h-4 w-4 text-cyan-400" />
                                {t("auth.registerWithWallet")}
                            </Button>

                            <div className="mt-6 text-center text-sm text-gray-400">
                                {t("auth.alreadyAccount")}{" "}
                                <Link href="/login" className="text-cyan-400 hover:underline">
                                    {t("auth.loginInstead")}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>© 2025 TrustBridge. All rights reserved.</p>
            </footer>
        </div>
    )
}

