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
      className={`${theme === "dark" ? "dark bg-[#0D1A2A] border-[#112430]" : "bg-white border-gray-200"} w-64 min-h-screen border-r p-0`}
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
              className={`flex items-center px-4 py-2 gap-2 w-full text-sm font-medium hover:bg-[#263141] rounded-md hover:text-[#56C3CE] dark:hover:text-[#56C3CE] hover:shadow-[1px_1px_15px_0px_rgba(12,35,50,0.74)] transition-all ${
                pathname === item.href
                  ? "text-[#56C3CE] bg-[#263141] shadow-[1px_1px_15px_0px_rgba(12,35,50,0.74)]"
                  : "text-gray-700 dark:text-gray-300"
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
