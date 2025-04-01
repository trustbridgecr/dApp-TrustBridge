import { ArrowRight, Wallet, Shield, Globe } from "lucide-react";
import Image from "next/image";
import { useWallet } from "../../hooks/useWallet.hook";
import { useGlobalAuthenticationStore } from "../../store/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const { handleConnect, handleDisconnect } = useWallet();
  const { address } = useGlobalAuthenticationStore();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 p-4 md:px-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Decentralized Microloans for Everyone
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Access low-interest microloans through blockchain
                    technology. Fast, secure, and accessible to all.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="bg-[var(--custom-blue)] hover:bg-blue-700 text-white"
                    onClick={address ? handleDisconnect : handleConnect}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {address ? "Disconnect Wallet" : "Connect Wallet"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--custom-celeste)] text-[var(--custom-blue)] hover:bg-blue-50 dark:hover:bg-white/10"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Card className="p-6 border border-[var(--custom-celeste)] bg-white/50 dark:bg-[#151515] backdrop-blur-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                    <Shield className="h-10 w-10 text-[var(--custom-blue)] mb-4" />
                    <h3 className="font-medium text-lg mb-2 text-foreground">
                      Secure Transactions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Powered by Stellar blockchain technology
                    </p>
                  </Card>
                  <Card className="p-6 border border-[var(--custom-celeste)] bg-white/50 dark:bg-[#151515] backdrop-blur-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                    <div className="h-10 w-10 mb-4 flex items-center justify-center">
                      <Image
                        src="/img/trustless-work-logo.png"
                        alt="Trustless Work Logo"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h3 className="font-medium text-lg mb-2 text-foreground">
                      Trustless Work
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Secure escrow contracts with non-custodial management
                    </p>
                  </Card>
                  <Card className="p-6 border border-[var(--custom-celeste)] bg-white/50 dark:bg-[#151515] backdrop-blur-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                    <Globe className="h-10 w-10 text-[var(--custom-blue)] mb-4" />
                    <h3 className="font-medium text-lg mb-2 text-foreground">
                      Global Access
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Available to underserved populations
                    </p>
                  </Card>
                  <Card className="p-6 border border-[var(--custom-celeste)] bg-white/50 dark:bg-[#151515] backdrop-blur-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[var(--custom-celeste)] rounded-full animate-ping opacity-25"></div>
                      <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-[var(--custom-blue)] text-white font-bold">
                        %
                      </div>
                    </div>
                    <h3 className="font-medium text-lg mb-2 mt-4 text-foreground">
                      Lower Rates
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Up to 70% lower than traditional banks
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
