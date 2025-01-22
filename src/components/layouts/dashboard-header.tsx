"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe, Bell } from "lucide-react";
import { useWallet } from "../auth/hooks/useWallet.hook";
import useHeaderWithoutAuth from "./hooks/dashboard-header.hook";

type Theme = "light" | "dark";
type Language = "es" | "en" | "fr" | "de";

const languages = [
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
];

export function DashboardHeader({
  theme,
  setTheme,
  setLanguage,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}) {
  const { address } = useHeaderWithoutAuth();
  const { handleConnect, handleDisconnect } = useWallet();

  return (
    <header className="w-full bg-white dark:bg-[#18181B] text-black dark:text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold"></h1>
        <div className="flex items-center space-x-2">
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
                  onClick={() => setLanguage(lang.code as Language)}
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
              type="button"
              onClick={handleDisconnect}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Disconnect
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Connect
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
