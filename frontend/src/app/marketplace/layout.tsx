"use client";

import React, { useEffect } from "react";
import Header from "@/components/layouts/header/Header";
import { useWalletContext } from "@/providers/wallet.provider";
import { useRouter } from "next/navigation";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { walletAddress } = useWalletContext();
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress) {
      router.replace("/");
    }
  }, [walletAddress, router]);

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-neutral-900">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
