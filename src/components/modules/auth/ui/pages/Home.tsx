"use client";

import { ArrowRight, Wallet, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useWallet } from "../../wallet/hooks/wallet.hook";
import { useEffect } from "react";

export default function HomePage() {
  const { handleConnect, handleDisconnect } = useWallet();
  const { address } = useGlobalAuthenticationStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen ">
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
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                  onClick={address ? handleDisconnect : handleConnect}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {address ? "Disconnect Wallet" : "Connect Wallet"}
                </Button>
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
                <div className="absolute inset-0 rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/50">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    alt="TrustBridge Platform"
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-950 rounded-lg shadow-lg p-4 border border-emerald-100 dark:border-emerald-900/50">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
