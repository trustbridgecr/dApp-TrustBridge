"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { Copy, Check } from "lucide-react";

interface LoanRequestDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  selectedRequest?: any;
  setSelectedRequest: (value?: any) => void;
}

const LoanRequestDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  setSelectedRequest,
}: LoanRequestDetailDialogProps) => {
  const { formatDollar, formatAddress, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(undefined);
  };

  if (!isDialogOpen || !selectedRequest) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-4xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedRequest.title} — Loan Offer
          </DialogTitle>
          <DialogDescription className="text-base">
            {selectedRequest.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-base font-medium">
              {formatDollar(selectedRequest.maxAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Platform Fee</p>
            <p className="text-base font-medium">
              {selectedRequest.platformFee}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Platform Address</p>
            <div className="flex items-center gap-2 text-sm font-mono">
              {formatAddress(selectedRequest.platformAddress)}
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  copyText(
                    selectedRequest.platformAddress,
                    selectedRequest.platformAddress,
                  )
                }
              >
                {copiedKeyId === selectedRequest.platformAddress ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Approver</p>
            <p className="text-sm font-mono">
              {formatAddress(selectedRequest.approver)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Release Signer</p>
            <p className="text-sm font-mono">
              {formatAddress(selectedRequest.releaseSigner)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dispute Resolver</p>
            <p className="text-sm font-mono">
              {formatAddress(selectedRequest.disputeResolver)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Submitted By</p>
            <p className="text-sm font-semibold">
              {selectedRequest.submittedBy?.name || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedRequest.submittedBy?.email || "No email"}
            </p>
            <p className="text-xs font-mono">
              {formatAddress(selectedRequest.submittedBy?.address || "")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="text-sm italic">
              {formatDateFromFirebase(
                selectedRequest.createdAt?.seconds,
                selectedRequest.createdAt?.nanoseconds,
              )}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold mb-2">Milestones</p>
          <ul className="space-y-2">
            {selectedRequest.milestones?.map((m: any, idx: number) => (
              <li
                key={idx}
                className="border p-3 rounded-md bg-muted/50 text-sm text-muted-foreground"
              >
                {m.description}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanRequestDetailDialog;
