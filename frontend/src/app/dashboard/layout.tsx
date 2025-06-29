"use client";

import React from "react";
import { Header } from "@/components/layouts/header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-neutral-900">
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
