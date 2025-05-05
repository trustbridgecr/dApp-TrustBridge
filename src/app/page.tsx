"use client";

import HomePage from "@/components/modules/auth/ui/pages/Home";
import { GradientBackground } from "@/components/modules/dashboard/ui/pages/background/GradientBackground";
import { useWalletStore } from "@/core/store/wallet/wallet.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const publicKey = useWalletStore((state) => state.publicKey); // Access the wallet's public key
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push("/dashboard"); 
    }
  }, [publicKey, router]);

  return (
    <GradientBackground>
      <div className="p-6">
        <HomePage />
      </div>
    </GradientBackground>
  );
}