"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

// Define types inline to avoid import errors
type ThemeType = "light" | "dark";
type LanguageType = "es" | "en";

interface HeaderProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

export default function DashboardPage() {
  // Initialize with type assertions to avoid type errors
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [language, setLanguage] = useState<LanguageType>(
    (typeof window !== "undefined" 
      ? localStorage.getItem("preferred-language") as LanguageType 
      : "en") || "en"
  );
  
  const { t, i18n } = useTranslation();

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Language effect
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("preferred-language", language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  // Type-safe props passing
  const headerProps: HeaderProps = {
    theme,
    setTheme,
    language,
    setLanguage
  };

  return (
    <div 
      className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}
      aria-label={t("dashboard.mainContainer")}
    >
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader {...headerProps} />
        <DashboardContent />
        <DashboardFooter />
      </div>
    </div>
  );
}