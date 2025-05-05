"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletStore } from "@/core/store/wallet/wallet.store";

interface RequireWalletProps {
  children: React.ReactNode;
}

const RequireWallet = ({ children }: RequireWalletProps) => {
  const publicKey = useWalletStore((state) => state.publicKey); 
  const router = useRouter();

  useEffect(() => {
    console.log("publicKey:", publicKey); 
    if (!publicKey) {
      router.push("/");
    }
  }, [publicKey, router]);

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Redirecting to connect your wallet...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireWallet;