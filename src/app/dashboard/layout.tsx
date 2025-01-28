"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { useTranslation } from 'react-i18next';
import { redirect } from "next/navigation";
import React from "react";
import '../i18n';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { address } = useGlobalAuthenticationStore();

  if (address === "") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default Layout;