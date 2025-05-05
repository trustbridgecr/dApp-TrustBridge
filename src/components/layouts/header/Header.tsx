"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWalletStore } from "@/core/store/wallet/wallet.store"; // Zustand store for wallet state

export function Header() {
  const router = useRouter();
  // const [walletConnected, setWalletConnected] = useState(false);
  // const { handleConnect, handleDisconnect } = useWallet();
  const setPublicKey = useWalletStore((state) => state.setPublicKey);
  // useEffect(() => {
  //   const stellarWallet = localStorage.getItem("address-wallet");
  //   const metamaskWallet = localStorage.getItem("metamask-wallet");

  //   if (stellarWallet || metamaskWallet) {
  //     setWalletConnected(true);
  //   }
  // }, []);

  const handleDisconnectWallet = () => {
    // Clear wallet-related data
    localStorage.removeItem("address-wallet");
    localStorage.removeItem("@StellarWalletsKit/usedWalletsIds");
    setPublicKey(null); // Clear the wallet public key from Zustand store
    // setWalletConnected(false); // Update local state
    console.log("Wallet disconnected");

    // Redirect to the home route
    router.push("/");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4">
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-gray-200 hidden sm:flex"
            onClick={() => {
              handleDisconnectWallet();
            }}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
