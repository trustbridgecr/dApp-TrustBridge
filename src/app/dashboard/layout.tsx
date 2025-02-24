"use client";

import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  return (
    <RouteGuard allowedRoles={['Borrower']}>
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
