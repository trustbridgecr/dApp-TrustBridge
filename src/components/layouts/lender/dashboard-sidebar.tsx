"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PiggyBank,
  Settings,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

const menuItems = [
  { icon: LayoutDashboard, labelKey: "sidebar.dashboard", href: "/lender/dashboard" },
  { icon: FileText, labelKey: "sidebar.requests", href: "/lender/dashboard/requests" },
  { icon: PiggyBank, labelKey: "sidebar.loans", href: "/lender/dashboard/loans" },
  { icon: Settings, labelKey: "sidebar.settings", href: "/lender/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white dark:bg-[#18181B] border-r border-gray-200 dark:border-none p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Trustbridge
        </h1>
      </div>
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 text-sm font-medium ${
              pathname === item.href
                ? "text-gray-700 dark:text-gray-300"
                : "text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("sidebar.logout")}</span>
        </Link>
      </div>
    </aside>
  );
}
