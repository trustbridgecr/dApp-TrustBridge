"use client";

import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";
import { useEffect } from "react";
import { ArrowRight, Wallet, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const { walletAddress } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-18 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="bg-emerald-800 text-emerald-800 border-emerald-800 mx-auto md:mx-0 w-fit"
              >
                Powered by Stellar Blockchain
              </Badge>

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-emerald-800 to-teal-500 bg-clip-text text-transparent">
                  TrustBridge
                </span>
                <span className="block mt-2">Decentralized Microloans</span>
              </h1>

              <p className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl mx-auto md:mx-0 leading-relaxed">
                Connecting lenders and borrowers through secure, transparent,
                and efficient blockchain technology. Build trust, create
                opportunity.
              </p>
            </div>

            {/* Mobile wallet address display */}
            {walletAddress && (
              <div className="flex sm:hidden items-center justify-center gap-2 px-3 py-2 bg-emerald-800 dark:bg-emerald-800 rounded-lg border border-emerald-800 dark:border-emerald-800 mx-auto w-fit">
                <Wallet className="w-4 h-4 text-emerald-800" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-800">
                  {truncateAddress(walletAddress)}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
              {walletAddress ? (
                <>
                  {/* Desktop wallet address display */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-800 dark:bg-emerald-800 rounded-lg border border-emerald-800 dark:border-emerald-800">
                    <Wallet className="w-4 h-4 text-emerald-800" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-800">
                      {truncateAddress(walletAddress)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleDisconnect}
                    className="w-full sm:w-auto hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-2">Disconnect Wallet</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleConnect}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white border-0"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="ml-2">Connect Wallet</span>
                </Button>
              )}

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-emerald-800 text-emerald-800 hover:bg-emerald-800 dark:border-emerald-800 dark:text-emerald-800 dark:hover:bg-emerald-800"
                >
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
