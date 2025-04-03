"use client";

import { useRouter } from "next/navigation";
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
import { useMarketplaceStore } from "../../store/marketplace";

interface MarketplaceLoanDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  selectedLoan?: any;
  setSelectedLoan: (value?: any) => void;
}

const MarketplaceLoanDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedLoan,
}: MarketplaceLoanDetailDialogProps) => {
  const { formatDollar, formatAddress, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();
  const router = useRouter();
  const { setSelectedLoan } = useMarketplaceStore();

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedLoan(undefined);
  };

  const handleRequestLoan = () => {
    setSelectedLoan(selectedLoan);
    router.push("/dashboard/loans/loan-request");
  };

  if (!isDialogOpen || !selectedLoan) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-4xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedLoan.title} — Available Loan
          </DialogTitle>
          <DialogDescription className="text-base">
            {selectedLoan.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-base font-medium">
              {formatDollar(selectedLoan.maxAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Platform Fee</p>
            <p className="text-base font-medium">{selectedLoan.platformFee}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Platform Address</p>
            <div className="flex items-center gap-2 text-sm font-mono">
              {formatAddress(selectedLoan.platformAddress)}
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  copyText(
                    selectedLoan.platformAddress,
                    selectedLoan.platformAddress,
                  )
                }
              >
                {copiedKeyId === selectedLoan.platformAddress ? (
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
              {formatAddress(selectedLoan.approver)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Release Signer</p>
            <p className="text-sm font-mono">
              {formatAddress(selectedLoan.releaseSigner)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dispute Resolver</p>
            <p className="text-sm font-mono">
              {formatAddress(selectedLoan.disputeResolver)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Published By</p>
            <p className="text-sm font-semibold">
              {selectedLoan.submittedBy?.name || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedLoan.submittedBy?.email || "No email"}
            </p>
            <p className="text-xs font-mono">
              {formatAddress(selectedLoan.submittedBy?.address || "")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Published At</p>
            <p className="text-sm italic">
              {formatDateFromFirebase(
                selectedLoan.createdAt?.seconds,
                selectedLoan.createdAt?.nanoseconds,
              )}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold mb-2">Milestones</p>
          <ul className="space-y-2">
            {selectedLoan.milestones?.map((m: any, idx: number) => (
              <li
                key={idx}
                className="border p-3 rounded-md bg-muted/50 text-sm text-muted-foreground"
              >
                {m.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleRequestLoan}
          >
            Apply for this Loan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceLoanDetailDialog;
