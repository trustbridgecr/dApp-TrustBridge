"use client";

import { DashboardFooter } from "@/components/layouts/Footer";
import { DashboardHeader } from "@/components/layouts/Header";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { BorrowerSidebar } from "@/components/layouts/borrower/Sidebar";
import ParticlesBackground from "@/components/lender/active-loans/ParticlesBackground";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  return (
    <RouteGuard allowedRoles={["Borrower"]}>
      <div className={`relative flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>

        <div className="absolute inset-0 -z-10">
          <ParticlesBackground />
        </div>


        <BorrowerSidebar />
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
