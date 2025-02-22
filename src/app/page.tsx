"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardFooter } from "@/components/layouts/dashboard-footer";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { create } from "zustand";

type AuthState = {
  role: string | null;
  setRole: (role: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role:
    typeof window !== "undefined" ? localStorage.getItem("userRole") || null : null,
  setRole: (role) => {
    if (role === null) {
      localStorage.removeItem("userRole");
    } else {
      localStorage.setItem("userRole", role);
    }
    set({ role });
  },
}));

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const address = useGlobalAuthenticationStore((state) => state.address);
  const { role, setRole } = useAuthStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (!role) {
      //fetchUserRole(address); // API Request
       setRole("lender"); // for test
      console.log("No role found, setting default role: lender");
    }
  }, [role, setRole]);

  console.log("ROL EN HOMEPAGE:", role);

  useEffect(() => {
    if (address && role) {
      if (role === "lender") {
        router.push("/admin");
      } else if (role === "borrower") {
        router.push("/dashboard");
      }
    }
  }, [address, role, router]);

  const fetchUserRole = async (walletAddress: string) => {
    try {
      const response = await fetch(`/users/role?wallet_address=${walletAddress}`);
      if (!response.ok) throw new Error(`Error fetching role: ${response.statusText}`);

      const data = await response.json();
      if (data.role) {
        setRole(data.role);
        console.log("User role fetched:", data.role);
      } else {
        console.log("No role found, user needs to select one.");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  };
// Function to clear rol
  const clearRole = () => {
    setRole(null);
    console.log("Role cleared from localStorage");
  };

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <DashboardHeader theme={theme} setTheme={setTheme} setLanguage={setLanguage} />
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
          manage loans without traditional intermediarios.
        </p>
      </main>
      {/* Test button*/}
      <div className="flex justify-center my-4">
        <button
          onClick={clearRole}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Limpiar rol
        </button>
      </div>
      <DashboardFooter />
    </div>
  );
}
