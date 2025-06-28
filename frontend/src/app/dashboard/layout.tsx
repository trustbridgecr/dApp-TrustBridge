"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TrustBridgeSidebar } from "@/components/layouts/sidebar/Sidebar";
import { Header } from "@/components/layouts/header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-neutral-900">
        <TrustBridgeSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
