"use client";

import { useState } from "react";
import type { Escrow } from "@/@types/escrow.entity";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { approveMilestone } from "../services/approver.service";
import { toast } from "sonner";

interface ApprovalConfirmationModalProps {
  escrow: Escrow;
  milestoneIndex: string;
  isOpen: boolean;
  onClose: () => void;
  onApprovalComplete: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ApprovalConfirmationModal({
  escrow,
  milestoneIndex,
  isOpen,
  onClose,
  onApprovalComplete,
  isLoading,
  setIsLoading,
}: ApprovalConfirmationModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await approveMilestone({
        contractId: escrow.contractId,
        milestoneIndex,
        newFlag: true,
      });

      setSuccess(true);
      toast.success("Milestone approved", {
        description: `Milestone ${Number.parseInt(milestoneIndex) + 1} has been successfully approved.`,
      });
      setTimeout(() => {
        onClose();
        onApprovalComplete();
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error approving milestone:", error);
      setError(
        error instanceof Error ? error.message : "Failed to approve milestone",
      );
      toast.error("Approval failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to approve milestone",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isLoading && !open && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Milestone</DialogTitle>
          <DialogDescription>
            You are about to approve milestone{" "}
            {Number.parseInt(milestoneIndex) + 1} for escrow &quot;
            {escrow.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-muted/50">
              <h4 className="font-medium mb-1">Milestone Details</h4>
              <p className="text-sm">
                {
                  escrow.milestones[Number.parseInt(milestoneIndex)]
                    ?.description
                }
              </p>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract ID:</span>
                <span className="font-mono truncate max-w-[200px]">
                  {escrow.contractId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Provider:</span>
                <span className="font-mono truncate max-w-[200px]">
                  {escrow.serviceProvider}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 border border-green-500/50 rounded-md bg-green-500/10 text-green-600 text-sm flex items-start gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Milestone successfully approved!</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApprove}
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approved
              </>
            ) : (
              "Approve Milestone"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
