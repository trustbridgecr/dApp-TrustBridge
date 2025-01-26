"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader theme={theme} setTheme={setTheme} setLanguage={setLanguage} />
        <DashboardContent />
        <DashboardFooter />
      </div>
    </div>
  );
}