import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet } from "lucide-react";
import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";

export const ConnectWalletWarning = () => {
  const { handleConnect } = useWallet();

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-full mb-4">
        <Wallet className="h-8 w-8 text-amber-600 dark:text-amber-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Wallet Connection Required</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        To access and interact with the Trustless Work API endpoints, you need
        to connect your Stellar wallet first.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleConnect} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <p>Your wallet information is never stored on our servers</p>
      </div>
    </div>
  );
};
