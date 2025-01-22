"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { address } = useGlobalAuthenticationStore();

  if (address === "") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default Layout;
