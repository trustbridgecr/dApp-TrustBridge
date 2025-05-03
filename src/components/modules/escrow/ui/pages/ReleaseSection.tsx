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
import { CircleDollarSign, AlertTriangle, Lock } from "lucide-react";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import { 
  createEscrowReleaseError, 
  isEscrowReleaseError, 
  EscrowReleaseError 
} from "../../types/errors";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ReleaseSectionProps {
  escrow: Escrow;
  onSuccess?: () => void;
}

export function ReleaseSection({ escrow, onSuccess }: ReleaseSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const areAllMilestonesCompleted = escrow.milestones?.every(
    (milestone) => milestone.status === "completed" && milestone.flag === true,
  );

  const incompleteMilestones = escrow.milestones?.filter(
    (milestone) => milestone.status !== "completed" || milestone.flag !== true
  );

  const getDisabledTooltipMessage = () => {
    if (!escrow.milestones?.length) {
      return "No milestones found";
    }
    if (!areAllMilestonesCompleted) {
      const count = incompleteMilestones?.length || 0;
      return `${count} milestone${count > 1 ? 's' : ''} still need${count === 1 ? 's' : ''} to be completed and approved`;
    }
    return "";
  };

  const handleRelease = async () => {
    try {
      setIsLoading(true);
      
      // Check wallet connection
      const { address } = await kit.getAddress().catch(() => {
        throw createEscrowReleaseError('WALLET_NOT_CONNECTED');
      });

      // Validate contract ID
      const contractId = escrow.contractId;
      if (!contractId) {
        throw createEscrowReleaseError('INVALID_CONTRACT');
      }

      // Attempt to release funds
      await distributeEscrowEarnings({
        contractId,
        signer: address,
      }).catch((error) => {
        if (error.message?.toLowerCase().includes('insufficient funds')) {
          throw createEscrowReleaseError('INSUFFICIENT_FUNDS', error);
        }
        if (error.message?.toLowerCase().includes('rejected')) {
          throw createEscrowReleaseError('TRANSACTION_REJECTED', error);
        }
        if (error.message?.toLowerCase().includes('unauthorized')) {
          throw createEscrowReleaseError('UNAUTHORIZED', error);
        }
        if (error.message?.toLowerCase().includes('contract')) {
          throw createEscrowReleaseError('CONTRACT_ERROR', error);
        }
        throw createEscrowReleaseError('UNKNOWN_ERROR', error);
      });

      toast({
        title: "Success",
        description: "Escrow funds have been released successfully.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error releasing escrow funds:", error);

      let errorMessage = "Failed to release escrow funds";

      if (isEscrowReleaseError(error)) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
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
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-4">
        <div className="flex items-center gap-5 justify-between">
          <div>
            <h3 className="text-lg font-semibold">Release Funds</h3>
            <p className="text-sm text-muted-foreground w-3/4">
              Release funds to the beneficiary once all milestones are completed
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!areAllMilestonesCompleted || isLoading}
                    className={cn(
                      "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white cursor-pointer",
                      (!areAllMilestonesCompleted || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {!areAllMilestonesCompleted && <Lock className="w-4 h-4 mr-2" />}
                    Release Funds
                  </Button>
                </div>
              </TooltipTrigger>
              {!areAllMilestonesCompleted && (
                <TooltipContent>
                  <p>{getDisabledTooltipMessage()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="w-full !max-w-[500px] h-auto max-h-[90vh] overflow-y-auto rounded-xl p-6 border-muted">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="text-green-800" size={24} />
                <DialogTitle>Confirm Release</DialogTitle>
              </div>
              <DialogDescription className="space-y-2">
                <p>
                  Are you sure you want to release the escrow funds? This action
                  cannot be undone.
                </p>
                <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-md">
                  <AlertTriangle className="text-yellow-600" size={16} />
                  <span className="text-sm text-yellow-600">
                    Please ensure your wallet is connected and has sufficient
                    funds for gas fees.
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
    </div>
  );
}
