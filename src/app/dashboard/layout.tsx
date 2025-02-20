"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  if (address === "") {
    redirect("/");
  }

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  return (
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
  );
};

export default Layout;
