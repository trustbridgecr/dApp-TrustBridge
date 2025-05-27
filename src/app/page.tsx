"use client";

import HomePage from "@/components/modules/auth/ui/pages/Home";
import { GradientBackground } from "@/components/modules/dashboard/ui/pages/background/GradientBackground";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

export default function Page() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();

  useEffect(() => {
    if (walletAddress) {
      router.push("/dashboard");
    }
  }, [walletAddress, router]);

  return (
    <GradientBackground>
      <div className="p-6">
        <HomePage />
      </div>
    </GradientBackground>
  );
}
