"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  if (address === "") {
    redirect("/");
  }
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="flex-1 ">{children}</div>
    </div>
  );
};

export default Layout;
