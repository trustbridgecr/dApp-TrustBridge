"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";

export default function HomePage() {
  const { handleConnect } = useWallet();

  return (
    <div className="flex flex-col bg-neutral-900 text-neutral-200">
      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-18 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-900/50 text-emerald-300 border-emerald-700 mx-auto md:mx-0 w-fit"
                >
                  Powered by Stellar Blockchain
                </Badge>

                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                    TrustBridge
                  </span>
                  <span className="block mt-2 text-neutral-100">
                    Decentralized Microloans
                  </span>
                </h1>

                <p className="max-w-[600px] text-neutral-400 text-base md:text-lg lg:text-xl mx-auto md:mx-0 leading-relaxed">
                  Connecting lenders and borrowers through secure, transparent,
                  and efficient blockchain technology. Build trust, create
                  opportunity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-0 text-white"
                  onClick={handleConnect}
                >
                  <LogIn className="h-3.5 w-3.5 mr-1.5" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
