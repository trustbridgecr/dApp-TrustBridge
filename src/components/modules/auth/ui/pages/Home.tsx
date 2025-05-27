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
      <section className="w-full  md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4"
              >
                Powered by Stellar Blockchain
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  TrustBridge
                </span>
                <span className="block mt-1">Decentralized Microloans</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                Connecting lenders and borrowers through secure, transparent,
                and efficient blockchain technology. Build trust, create
                opportunity.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row mt-4">
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
                    size="lg"
                    onClick={handleDisconnect}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-2">Disconnect Wallet</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleConnect}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white border-0"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="ml-2">Connect Wallet</span>
                </Button>
              )}

              <Link href="/dashboard/marketplace" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Explore Marketplace
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
