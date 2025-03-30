"use client";

import { DashboardHeader } from "@/components/layouts/Header";
import { useState } from "react";
import { LoanRequestForm } from "./loan-request-form";

export default function LoanRequestPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  // Mock wallet address for demonstration
  const [address] = useState<string | null>(
    "0xf3B1E8F0A1D9B2c988F428171bB935378265a9d8"
  );

  return (
    <div className="flex min-h-screen bg-[#050A14] bg-opacity-95 text-white relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,30,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,30,60,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]"></div>

        {/* Contenido principal con z-index para que esté por encima de los efectos */}
        <div className="flex-1 w-full max-w-6xl mx-auto relative z-10 p-6">
          {/* Header with futuristic elements */}
          <div className="relative mb-10">
            <div className="flex justify-between items-center relative z-10">
              <div className="relative">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Loan Request
                </h1>
                <div className="h-1 w-3/4 mt-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                <div className="h-1 w-1/2 mt-1 bg-gradient-to-r from-blue-500/50 to-emerald-500/50 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2 bg-[#0A1A2A]/80 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-900/30 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-cyan-100">
                  New Application
                </span>
              </div>
            </div>
          </div>

          {/* Loan Request Form */}
          <LoanRequestForm />
        </div>
      </div>
    </div>
  );
}
