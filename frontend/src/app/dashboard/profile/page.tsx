"use client";

import { useWalletContext } from "@/providers/wallet.provider";
import { Card } from "@/components/ui/card";
import UserProfileForm from "@/components/modules/profile/ui/UserProfileForm";

export default function SettingsPage() {
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8">
          <p className="text-muted-foreground text-center">
            Wallet not connected or invalid target.
          </p>
        </Card>
      </div>
    );
  }

  return <UserProfileForm />;
}
