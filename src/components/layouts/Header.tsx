"use client";

import "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe, Bell, User } from "lucide-react";
import { useWallet } from "../auth/hooks/useWallet.hook";
import RoleSelectionModal from "@/components/ui/role";
import useHeaderWithoutAuth from "../../hooks/use-header";
import { SidebarTrigger } from "../ui/sidebar";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

const languages = [
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
];

export interface DashboardHeaderProps {
  theme: "light" | "dark";
  setTheme: Dispatch<SetStateAction<"light" | "dark">>;
  setLanguage: Dispatch<SetStateAction<"es" | "en" | "fr" | "de">>;
  address?: string | null;
}

export function DashboardHeader({
  theme,
  setTheme,
  setLanguage,
}: DashboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const { address } = useHeaderWithoutAuth();

  const {
    showRoleModal,
    handleConnect,
    handleDisconnect,
    handleSelectRole,
    setShowRoleModal,
  } = useWallet();

  const hasUnreadNotifications = true;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="w-full backdrop-blur-md bg-[#0A1A2A]/60 border-b border-cyan-900/30 shadow-[0_4px_15px_rgba(0,200,255,0.1)] px-6 py-3">
      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center justify-end gap-x-2">
          <SidebarTrigger className="mr-auto inline-block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem] text-cyan-300 stroke-2" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-[1.2rem] w-[1.2rem] text-cyan-300 stroke-2" />
                <span className="sr-only">Toggle Access System</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/auth/register">Register</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/login">Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem] text-cyan-300 stroke-2" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-400 rounded-full" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {address ? (
            <div className="flex items-center ml-2">
              <div className="mr-3 hidden md:block">
                <p className="text-xs text-white/60">Connected as</p>
                <p className="text-sm text-cyan-300 font-mono">
                  {address.substring(0, 6)}...
                  {address.substring(address.length - 4)}
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                type="button"
                className="relative overflow-hidden px-4 py-2 rounded-full bg-[#0A1A2A]/80 border border-cyan-900/30 text-white text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(0,200,255,0.3)] group"
              >
                <span className="relative z-10">{t("header.disconnect")}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              type="button"
              className="relative overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(0,200,255,0.3)]"
            >
              <span className="relative z-10">{t("header.connect")}</span>
            </button>
          )}
        </div>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectRole={handleSelectRole}
      />
    </header>
  );
}
