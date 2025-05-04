import { useEffect } from "react";
import { useProviderEscrows } from "../hooks/use-provider-escrows.hook";
import { EscrowList } from "./EscrowList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "../../auth/wallet/hooks/wallet.hook";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useEscrowBoundedStore } from "../store/ui";

export const ProviderDashboard = () => {
  const { escrows, loading, refetch } = useProviderEscrows();
  const { handleConnect } = useWallet();

  const walletConnected = useEscrowBoundedStore(
    (state) => state.walletConnected,
  );
  const checkWalletConnection = useEscrowBoundedStore(
    (state) => state.checkWalletConnection,
  );

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  if (!walletConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Service Provider Dashboard</CardTitle>
          <CardDescription>
            Connect your wallet to manage your escrows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Wallet className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="mb-4 text-center text-muted-foreground">
              You need to connect your wallet to view and manage your escrows
            </p>
            <Button onClick={handleConnect} className="w-full max-w-xs">
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Provider Dashboard</CardTitle>
        <CardDescription>Manage your escrows and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <EscrowList escrows={escrows} onMilestoneComplete={refetch} />
        )}
      </CardContent>
    </Card>
  );
};
