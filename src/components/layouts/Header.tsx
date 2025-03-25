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
import { Moon, Sun, Globe, Bell } from "lucide-react";
import { useWallet } from "../auth/hooks/useWallet.hook";
import RoleSelectionModal from "@/components/ui/role"; 
import useHeaderWithoutAuth from "../../hooks/use-header";

type Theme = "light" | "dark";

const languages = [
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
];

interface DashboardHeaderProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "es" | "en" | "fr" | "de") => void;
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
    setShowRoleModal 
  } = useWallet(); 

  // This should come from your notifications system
  const hasUnreadNotifications = true; // Example state

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="w-full bg-white dark:bg-darkbg text-black dark:text-white px-6 py-4">
      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem] stroke-[#b5eeff] stroke-2" />
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

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem] stroke-[#b5eeff] stroke-2" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {address ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">
                  Connected as
                </span>
                <span className="text-sm font-medium text-[#b5eeff]">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="ghost"
                className="border border-gray-100/20 
                hover:bg-gradient-to-br hover:from-green-900/90 hover:to-blue-950/90 hover:text-white 
                hover:shadow-lg hover:shadow-blue-950/50
                rounded-full 
                focus:border-0 focus:bg-gradient-to-br focus:from-green-900/90 focus:to-blue-950/90 focus:text-white 
                focus:shadow-lg focus:shadow-blue-950/50
                active:bg-gradient-to-br active:from-green-900/90 active:to-blue-950/90 active:text-white"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              variant="default"
              className="bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl"
            >
              {t("header.connect")}
            </Button>
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
