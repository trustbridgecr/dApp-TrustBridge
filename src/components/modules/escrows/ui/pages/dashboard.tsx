"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useWalletContext } from "@/providers/wallet.provider";
import { MainTabs } from "../tabs/MainTabs";
import { ConnectWalletWarning } from "../ConnectWalletWarning";

export function Loans() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="space-y-8 p-4">
      <Card className="shadow-none border-0">
        {/* Nuevo Header con texto anterior */}
        <div className="flex flex-col gap-2 p-4 pb-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-emerald-800 to-teal-500 rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          </div>
          <p className="text-muted-foreground pl-3 border-l-2 border-muted">
            Manage escrow contracts and interact with the Stellar blockchain
            using the <span className="font-bold">Trustless Work API.</span>
          </p>
        </div>

        <CardContent className="p-0 pt-4">
          {walletAddress ? <MainTabs /> : <ConnectWalletWarning />}
        </CardContent>
      </Card>
    </div>
  );
}
