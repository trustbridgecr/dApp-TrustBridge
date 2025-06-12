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
import { useUserEscrows } from "../../hooks/use-user-escrows.hook";
import { EscrowList } from "../components/EscrowList";
import { useEffect } from "react";
import { toast } from "sonner";

export function Loans() {
  const { walletAddress } = useWalletContext();
  const { escrows, loading, error } = useUserEscrows(walletAddress || "");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 p-4">
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
      {walletAddress && (
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-xl">Your Escrows</CardTitle>
          </CardHeader>
          <CardContent>
            <EscrowList escrows={escrows} loading={loading} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
