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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="w-full bg-white dark:bg-darkbg text-black dark:text-white px-6 py-4">
      <div className="flex items-center justify-end space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-black dark:text-white"
            >
              <Globe className="h-[1.2rem] w-[1.2rem]" />
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

        <Button
          variant="ghost"
          size="icon"
          className="text-black dark:text-white"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-black dark:text-white"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Notifications</span>
        </Button>

        {address ? (
          <button
            onClick={handleDisconnect}
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {t("header.disconnect")}
          </button>
        ) : (
          <button
            onClick={handleConnect} 
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {t("header.connect")}
          </button>
        )}
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectRole={handleSelectRole}
      />
    </header>
  );
}
