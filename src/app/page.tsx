"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const router = useRouter();

  const address = useGlobalAuthenticationStore((state) => state.address);
  const [storedRole, setStoredRole] = useState<string | null>(
    localStorage.getItem("userRole")
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (address) {
      const role = localStorage.getItem("userRole");
      if (role) {
        setStoredRole(role);
        registerUserBeforeRedirect(address, role);
      } else {
        router.push("/dashboard");
      }
    }
  }, [address, router]);

  const retryFetch = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Attempt ${attempt}: ${response.statusText}`);
        return await response.json();
      } catch (error) {
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return null; 
  };

  const registerUserBeforeRedirect = async (walletAddress: string, role: string) => {
    console.log("User selected role:", role);
    
    const data = {
      wallet_address: walletAddress,
      role: role.toLowerCase(),
    };

    const result = await retryFetch("/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!result) {
      console.error("Failed to register user after 3 attempts.");
    } else {
      console.log("Registration successful:", result);
    }

    router.push("/dashboard");
  };

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <DashboardHeader
        theme={theme}
        setTheme={setTheme}
        setLanguage={setLanguage}
      />
      <main className="flex-1 flex flex-col sm:flex-row justify-center items-center bg-white dark:bg-[#18181B] text-black dark:text-gray-100 mt-20 gap-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left">
          Welcome to <br /> TrustBridge
        </h1>
        <hr className="hidden md:block bg-gray-200 dark:bg-gray-600 w-0.5 h-96" />
        <p className="text-xl md:w-1/2 text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
            TrustBridge is a decentralized platform
          </span>{" "}
          designed to facilitate <strong>P2P microloans</strong> securely,
          transparently, and efficiently. We connect lenders and borrowers
          through <strong>blockchain technology</strong>, leveraging{" "}
          <strong>smart contracts</strong> to automate and secure transactions.
          Our approach promotes <strong>financial inclusion</strong>, empowering
          global communities by providing accessible and reliable tools to
          manage loans without traditional intermediaries.
        </p>
      </main>
      <DashboardFooter />
    </div>
  );
}
