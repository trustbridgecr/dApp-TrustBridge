"use client";

import { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect authenticated users
  if (isAuthenticated && user) {
    if (user.role === "Lender") {
      redirect("/lender/dashboard");
    } else if (user.role === "Borrower") {
      redirect("/dashboard");
    }
  }

  // Only render the homepage content for non-authenticated users
  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <DashboardHeader theme={theme} setTheme={setTheme} setLanguage={setLanguage} />
      <main className="flex-1 flex flex-col sm:flex-row justify-center items-center bg-white dark:bg-[#18181B] text-black dark:text-gray-100 mt-20 gap-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left">
          {t("homepage.title", "Welcome to")} <br />{" "}
          {t("homepage.title.part2", "TrustBridge")}
        </h1>
        <hr className="hidden md:block bg-gray-200 dark:bg-gray-600 w-0.5 h-96" />
        <p className="text-xl md:w-1/2 text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
            {t("homepage.subtitle", "TrustBridge is a decentralized platform")}
          </span>{" "}
          {t(
            "homepage.body",
            "designed to facilitate P2P microloans securely, transparently, and efficiently. We connect lenders and borrowers through blockchain technology, leveraging smart contracts to automate and secure transactions. Our approach promotes financial inclusion, empowering global communities by providing accessible and reliable tools to manage loans without traditional intermediaries."
          )}
        </p>
      </main>
      <DashboardFooter />
    </div>
  );
}
