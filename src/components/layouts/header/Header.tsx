"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";

export function Header() {
  const { handleDisconnect } = useWallet();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handleDisconnect}
          size="icon"
          className="h-9 w-9"
        >
          <LogOut className="text-red-500 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
