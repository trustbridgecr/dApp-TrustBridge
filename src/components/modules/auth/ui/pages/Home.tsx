"use client";

import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";
import { useEffect } from "react";
import { ArrowRight, Wallet, BadgeCheck, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

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
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
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

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/3] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-1 shadow-xl">
                <div className="absolute -bottom-6 -right-6 z-20 bg-white dark:bg-neutral-950 rounded-lg shadow-lg p-4 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-2">
                      <BadgeCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Loan Volume
                      </p>
                      <p className="text-lg font-bold">$1.2M+</p>
                    </div>
                  </div>
                </div>

                {/* Imagen decorativa o espacio para gráficos */}
                <div className="absolute inset-0 p-4 z-10 flex items-center justify-center">
                  <Image
                    src="/img/illustration-loan.png"
                    alt="Loan Illustration"
                    width={300}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
