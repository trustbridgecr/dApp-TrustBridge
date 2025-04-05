"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TrustBridgeSidebar } from "@/components/layouts/sidebar/Sidebar";
import { Header } from "@/components/layouts/header/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <TrustBridgeSidebar />
        <div className="flex-1 ">
          <div className="z-index-10000">
            <Header />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
