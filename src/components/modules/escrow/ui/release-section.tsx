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
import { distributeEscrowEarnings } from "../services/distribute-escrow-earnings.service";
import { Escrow } from "@/@types/escrow.entity";
import { CircleDollarSign } from "lucide-react";
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to release escrow funds",
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
          disabled={!areAllMilestonesCompleted || isLoading}
          className="bg-green-800 hover:bg-green-700"
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
            <DialogDescription>
              Are you sure you want to release the escrow funds? This action cannot be undone.
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
              className="bg-green-800 hover:bg-green-700"
            >
              {isLoading ? "Releasing..." : "Confirm Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 