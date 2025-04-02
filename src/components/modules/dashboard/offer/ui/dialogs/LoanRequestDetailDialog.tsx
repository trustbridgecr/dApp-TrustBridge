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
      <DialogContent className="w-full max-w-3xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedRequest.title} — Loan Offer
          </DialogTitle>
          <DialogDescription>{selectedRequest.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">
              {formatDollar(selectedRequest.maxAmount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Platform Fee</p>
            <p className="font-medium">{selectedRequest.platformFee}%</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Platform Address</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {formatAddress(selectedRequest.platformAddress)}
              </span>
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
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Approver</p>
            <p className="font-mono text-sm">
              {formatAddress(selectedRequest.approver)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Release Signer</p>
            <p className="font-mono text-sm">
              {formatAddress(selectedRequest.releaseSigner)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Dispute Resolver</p>
            <p className="font-mono text-sm">
              {formatAddress(selectedRequest.disputeResolver)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Submitted By</p>
            <p className="font-medium">
              {selectedRequest.submittedBy?.name || "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedRequest.submittedBy?.email || "No email"}
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              {formatAddress(selectedRequest.submittedBy?.address || "")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="italic text-sm">
              {formatDateFromFirebase(
                selectedRequest.createdAt?.seconds,
                selectedRequest.createdAt?.nanoseconds,
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2">Milestones</p>
          <ul className="space-y-2">
            {selectedRequest.milestones?.map((m: any, idx: number) => (
              <li key={idx} className="border p-3 rounded-md">
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
