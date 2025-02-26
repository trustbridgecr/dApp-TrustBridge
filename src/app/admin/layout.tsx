"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [language, setLanguage] = useState<"es" | "en">("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const address = useGlobalAuthenticationStore((state) => state.address);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);
  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col dark:bg-[#18181B]">
        <DashboardHeader
          theme={theme}
          setTheme={setTheme}
          setLanguage={setLanguage}
        />
        {React.cloneElement(children as React.ReactElement<any>, {
          language,
          setLanguage,
        })}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default Layout;
