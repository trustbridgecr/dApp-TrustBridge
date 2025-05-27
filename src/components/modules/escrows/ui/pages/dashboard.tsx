"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletContext } from "@/providers/wallet.provider";
import { MainTabs } from "../tabs/MainTabs";
import { ConnectWalletWarning } from "../ConnectWalletWarning";

export function Loans() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="space-y-8 p-6">
      <Card className="shadow-none border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Loans</CardTitle>
          <CardDescription>
            Manage escrow contracts and interact with the Stellar blockchain
            using the <span className="font-bold">Trustless Work API.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {walletAddress ? <MainTabs /> : <ConnectWalletWarning />}
        </CardContent>
      </Card>
    </div>
  );
}
