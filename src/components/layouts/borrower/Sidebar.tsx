"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import "@/lib/i18n";
import {
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const menuItems = [
  {
    icon: LayoutDashboard,
    labelKey: "sidebar.dashboard",
    href: "/borrower/dashboard",
  },
  {
    icon: FileText,
    labelKey: "sidebar.requests",
    href: "/borrower/dashboard/requests",
  },
  {
    icon: PiggyBank,
    labelKey: "sidebar.loans",
    href: "/borrower/dashboard/loans",
  },
  {
    icon: Settings,
    labelKey: "sidebar.settings",
    href: "/borrower/dashboard/settings",
  },
];

export function BorrowerSidebar({ theme }: { theme: "light" | "dark" }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Sidebar
      className={`${theme === "dark" ? "dark bg-dark border-gray-700" : "bg-white border-gray-200"} w-64 min-h-screen bg-white border-r p-0`}
    >
      <SidebarHeader className="flex items-center flex-row p-4">
        <Image
          src="/img/TrustBridge.png"
          alt="TrustBridge"
          width={50}
          height={50}
        />
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          TrustBridge
        </h1>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 gap-2 w-full text-sm rounded-md font-medium ${
                pathname === item.href
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.labelKey)}</span>
              {pathname === item.href && (
                <ChevronRight className="h-4 w-4 ml-auto block" />
              )}
            </Link>
          ))}
        </SidebarGroup>
        <SidebarGroup className="mt-auto space-y-4 px-4 py-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>{t("sidebar.logout")}</span>
          </Link>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
