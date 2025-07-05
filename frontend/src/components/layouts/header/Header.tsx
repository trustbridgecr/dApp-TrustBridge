"use client";

import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  Wallet,
  FlaskConical,
  Menu,
  MessageSquare,
  User,
  ShoppingCart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  const { walletAddress } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-700 bg-neutral-800/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <FlaskConical className="h-7 w-7 text-emerald-400" />
            <span className="sr-only">TrustBridge</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100 transition-colors"
              prefetch={false}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/marketplace"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100 transition-colors flex items-center gap-2"
              prefetch={false}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard/profile"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100 transition-colors"
              prefetch={false}
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {walletAddress ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700/50 rounded-lg border border-neutral-600">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-neutral-300">
                    {truncateAddress(walletAddress)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100"
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                onClick={handleConnect}
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Connect Wallet
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600 hover:text-neutral-100"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-neutral-800 border-neutral-700 text-neutral-200"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/marketplace"
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Marketplace</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/chat"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
