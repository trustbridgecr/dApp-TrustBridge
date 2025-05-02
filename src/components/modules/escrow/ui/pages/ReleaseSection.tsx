import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/toast.hook";
import { distributeEscrowEarnings } from "@/components/modules/escrow/services/distribute-escrow-earnings.service";
import { Escrow } from "@/@types/escrow.entity";
import { CircleDollarSign, AlertTriangle } from "lucide-react";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";

interface ReleaseSectionProps {
  escrow: Escrow;
  onSuccess?: () => void;
}

export function ReleaseSection({ escrow, onSuccess }: ReleaseSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const areAllMilestonesCompleted = escrow.milestones?.every(
    (milestone) => milestone.status === "completed" && milestone.flag === true
  );

  // If milestones are not completed, don't render anything
  if (!areAllMilestonesCompleted) {
    return null;
  }

  const handleRelease = async () => {
    try {
      setIsLoading(true);
      const { address } = await kit.getAddress();
      
      const contractId = escrow.contractId;
      if (!contractId) {
        throw new Error("Contract ID is missing");
      }
      
      await distributeEscrowEarnings({
        contractId,
        signer: address,
      });
      
      toast({
        title: "Success",
        description: "Escrow funds have been released successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      console.error("Error releasing escrow funds:", error);
      
      let errorMessage = "Failed to release escrow funds";
      
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.toLowerCase().includes("insufficient funds")) {
          errorMessage = "Insufficient funds to complete the transaction";
        } else if (error.message.toLowerCase().includes("rejected")) {
          errorMessage = "Transaction was rejected. Please try again";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Release Funds</h3>
          <p className="text-sm text-muted-foreground">
            Release funds to the beneficiary once all milestones are completed
          </p>
        </div>
        <Button
          onClick={() => setShowConfirmDialog(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
        >
          Release Funds
        </Button>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-full !max-w-[500px] h-auto max-h-[90vh] overflow-y-auto rounded-xl p-6 bg-background">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="text-green-800" size={24} />
              <DialogTitle>Confirm Release</DialogTitle>
            </div>
            <DialogDescription className="space-y-2">
              <p>Are you sure you want to release the escrow funds? This action cannot be undone.</p>
              <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="text-yellow-600" size={16} />
                <span className="text-sm text-yellow-600">
                  Please ensure your wallet is connected and has sufficient funds for gas fees.
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRelease}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
            >
              {isLoading ? "Releasing..." : "Confirm Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 