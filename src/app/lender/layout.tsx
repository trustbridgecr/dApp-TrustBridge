'use client';

import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/lender/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import type React from "react";
import { useState, useEffect } from "react";

export default function LenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <RouteGuard allowedRoles={['Lender']}>
      <div className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            theme={theme}
            setTheme={setTheme}
            setLanguage={setLanguage}
          />
          {children}
          <DashboardFooter />
        </div>
      </div>
    </RouteGuard>
  );
} 