"use client";

import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Wallet } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const { walletAddress } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4">
        <div className="ml-auto flex items-center gap-2">
          {walletAddress ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {truncateAddress(walletAddress)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-gray-200 hidden sm:flex"
                onClick={handleDisconnect}
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-0 text-white hidden sm:flex"
              onClick={handleConnect}
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
