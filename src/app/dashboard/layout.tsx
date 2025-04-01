"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { redirect } from "next/navigation";
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TrustBridgeSidebar } from "@/layouts/sidebar/Sidebar";
import { Header } from "@/layouts/header/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  if (!address) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <TrustBridgeSidebar />
        <div className="flex-1 ">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
