"use client";

import HomePage from "@/components/modules/auth/ui/pages/Home";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import HeaderHome from "@/components/layouts/header/HeaderHome";

export default function Page() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();

  useEffect(() => {
    if (walletAddress) {
      router.push("/dashboard");
    }
  }, [walletAddress, router]);

  return (
    <div className="min-h-screen flex flex-col w-full bg-neutral-900">
      <HeaderHome />
      <HomePage />
    </div>
  );
}
