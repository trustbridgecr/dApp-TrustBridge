"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PiggyBank,
  Settings,
  LogOut,
  CreditCard,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

const menuItems = [
  { icon: LayoutDashboard, labelKey: "sidebar.dashboard", href: "/lender/dashboard" },
  { icon: FileText, labelKey: "sidebar.activeLoans", href: "/lender/dashboard/active-loans" },
  { icon: PiggyBank, labelKey: "sidebar.auditLogs", href: "/lender/dashboard/audit-logs" },
  { icon: Wallet, labelKey: "sidebar.loanRequests", href: "/lender/dashboard/loan-requests" },
  { icon: CreditCard, labelKey: "sidebar.repayments", href: "/lender/dashboard/repayments" },
  { icon: Settings, labelKey: "sidebar.settings", href: "/lender/dashboard/settings" },
];

export function LenderSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside
      role="navigation"
      aria-label="Sidebar"
      className="flex flex-col w-60 min-h-screen bg-[#081B2C] text-white">

      {/* Header con el logo/ícono */}
      <div className="flex items-center px-0 py-5 sm:px-3 md:px-5">
        <Image src="/img/TrustBridge.png" alt="TrustBridge" width={50} height={50} className="w-10 h-10 sm:w-12 sm:h-12" />
        <h1 className="text-xl sm:text-2xl font-bold text-dark dark:text-white">TrustBridge</h1>
      </div>


      {/* Menú principal */}
      <nav className="flex-1 px-4 space-y-1" role="menu">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center p-2 rounded-md transition-colors 
                focus:outline-none focus:shadow-[0_0_0_2px_#06b6d4]
                ${
                  isActive
                    ? "bg-[#0E2A3A] shadow-[0_0_0_2px_#06b6d4]" 
                    : "hover:bg-[#0F2C3D]"
                }
              `}
              
            >
              {/* Ícono */}
              <item.icon className="h-5 w-5 mr-2 text-white" />
              {/* Texto traducido */}
              <span className="text-sm font-medium">{t(item.labelKey)}</span>

              {/* Pequeño indicador (dot) cuando está activo */}
              {isActive && (
                <span
                  className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sección Logout al final. */}
      <div className="mt-auto px-4 py-2">
        <Link
          href="/"
          role="menuitem"
          className={`group flex items-center p-2 rounded-md transition-colors 
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#081B2C]
            hover:bg-[#0F2C3D]
          `}
        >
          <LogOut className="h-5 w-5 mr-3 text-white" />
          <span className="text-sm font-medium">{t("sidebar.logout")}</span>
        </Link>
      </div>
    </aside>
  );
}