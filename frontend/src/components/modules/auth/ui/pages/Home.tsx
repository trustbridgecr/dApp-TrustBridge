"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";

export default function HomePage() {
  const { walletAddress } = useWalletContext();
  const { handleConnect } = useWallet();
  const router = useRouter();

  const handleConnectWallet = async () => {
    if (!walletAddress) {
      await handleConnect();
    }
    // After successful connection, redirect to dashboard
    if (walletAddress) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col bg-dark-primary text-light ">
      <div className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-18 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <span className="network-badge mx-auto md:mx-0 w-fit">
                  Powered by Stellar Blockchain
                </span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="text-success">TrustBridge</span>
                  <span className="block mt-2 text-white">
                    Decentralized Microloans
                  </span>
                </h1>
                <p className="max-w-[600px] text-gray-400 text-base md:text-lg lg:text-xl mx-auto md:mx-0 leading-relaxed">
                  Connecting lenders and borrowers through secure, transparent,
                  and efficient blockchain technology. Build trust, create
                  opportunity.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start pt-6">
                <button className="btn-primary" onClick={handleConnectWallet}>
                  <i className="fas fa-wallet mr-2"></i>
                  {walletAddress ? "Go to Dashboard" : "Connect Wallet"}
                </button>

                <Link href="https://trustbridge.gitbook.io/docs">
                  <div className="btn-secondary inline-flex items-center">
                    <i className="fas fa-book-open mr-2"></i>
                    Learn More
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
