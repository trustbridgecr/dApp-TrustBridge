"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical, Wallet, Menu, LogIn, LogOut } from "lucide-react";
import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";

export default function AppHeader() {
  const { walletAddress } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-700 bg-neutral-800/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <FlaskConical className="h-7 w-7 text-emerald-400" />
            <span className="sr-only">TrustBridge</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {walletAddress ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {truncateAddress(walletAddress)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-gray-200"
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
                className="border-0 text-white"
                onClick={handleConnect}
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Connect Wallet
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600 hover:text-neutral-100"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
