"use client";

import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";
import NotificationButton from "@/components/modules/notifications/NotificationButton";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const { handleConnect, handleDisconnect } = useWallet();

  useEffect(() => {
    const stellarWallet = localStorage.getItem("address-wallet");
    const metamaskWallet = localStorage.getItem("metamask-wallet");

    if (stellarWallet || metamaskWallet) {
      setWalletConnected(true);
    }
  }, []);

  const handleDisconnectWallet = () => {
    handleDisconnect();
    localStorage.removeItem("address-wallet");
    localStorage.removeItem("@StellarWalletsKit/usedWalletsIds");
    setWalletConnected(false);
    console.log("Wallet disconnected");
    router.push("/");
  };

  const handleConnectWallet = () => {
    handleConnect();
    setWalletConnected(true);
    console.log("Wallet connected");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4">
        <div className="ml-auto flex items-center gap-2">
          {walletConnected && <NotificationButton />}
          {walletConnected ? (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-gray-200 hidden sm:flex"
              onClick={handleDisconnectWallet}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Disconnect Wallet
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-0 text-white hidden sm:flex"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
