"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Login } from "@/components/auth/login";
import { Register } from "@/components/auth/register";
import { ForgotPassword } from "@/components/auth/forgot-password";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [authView, setAuthView] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const router = useRouter();

  const address = useGlobalAuthenticationStore((state) => state.address);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLogin = () => {
    console.log("User authenticated");
    router.push("/dashboard");
  };

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <DashboardHeader
        theme={theme}
        setTheme={setTheme}
        setLanguage={setLanguage}
      />
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#18181B] text-black dark:text-gray-100">
        {authView === "login" && (
          <Login
            onSwitchToRegister={() => setAuthView("register")}
            onForgotPassword={() => setAuthView("forgotPassword")}
            onLogin={handleLogin}
          />
        )}
        {authView === "register" && (
          <Register onSwitchToLogin={() => setAuthView("login")} />
        )}
        {authView === "forgotPassword" && (
          <ForgotPassword onBackToLogin={() => setAuthView("login")} />
        )}
      </div>
      <DashboardFooter />
    </div>
  );
}
