"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Check,
  DollarSign,
  Calendar,
  User,
  Shield,
  Gavel,
  Milestone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoanRequestDetail } from "@/components/modules/admin/hooks/useLoanRequestDetail.hook";
import type { ApprovedLoan } from "@/components/modules/dashboard/marketplace/store/marketplace";

interface LoanRequestDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  selectedRequest?: ApprovedLoan;
  setSelectedRequest: (value?: ApprovedLoan) => void;
}

const LoanRequestDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  setSelectedRequest,
}: LoanRequestDetailDialogProps) => {
  const {
    formatDollar,
    formatAddress,
    formatDateFromFirebase,
    copyText,
    copiedKeyId,
    handleClose,
  } = useLoanRequestDetail(
    isDialogOpen,
    setIsDialogOpen,
    selectedRequest,
    setSelectedRequest,
  );

  if (!isDialogOpen || !selectedRequest) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-4xl rounded-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-900 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedRequest.title}
              </DialogTitle>
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30"
              >
                Pending Approval
              </Badge>
            </div>
            <DialogDescription className="text-base text-white/90 mt-2">
              {selectedRequest.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent h-14 mb-4">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-background"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="milestones"
                className="data-[state=active]:bg-background"
              >
                Milestones
              </TabsTrigger>
              <TabsTrigger
                value="parties"
                className="data-[state=active]:bg-background"
              >
                Parties
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="details"
            className="p-6 pt-4 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-emerald-100 rounded-full p-3">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Maximum Loan Amount
                    </p>
                    <p className="text-2xl font-bold">
                      {formatDollar(selectedRequest.maxAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Platform Fee
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedRequest.platformFee}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Platform Address
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <code className="text-sm font-mono flex-1 truncate">
                      {selectedRequest.platformAddress}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        copyText(
                          selectedRequest.platformAddress,
                          selectedRequest.platformAddress,
                        )
                      }
                      className="h-8 w-8"
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Created At
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {formatDateFromFirebase(
                        selectedRequest.createdAt?.seconds || 0,
                        selectedRequest.createdAt?.nanoseconds || 0,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="milestones"
            className="p-6 pt-4 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Milestone className="h-5 w-5 text-amber-600" />
                <h3 className="font-medium">Loan Milestones</h3>
              </div>

              {(selectedRequest.milestones ?? []).length > 0 ? (
                <div className="space-y-3">
                  {selectedRequest.milestones?.map((m, idx) => (
                    <div
                      key={idx}
                      className="border p-4 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 rounded-full p-1.5 mt-0.5">
                          <span className="text-xs font-bold text-amber-700">
                            {idx + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm">{m.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No milestones defined for this loan
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="parties"
            className="p-6 pt-4 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Submitted By</h3>
                </div>
                <p className="text-base font-semibold">
                  {selectedRequest.submittedBy?.name || "Unknown"}
                </p>
                {selectedRequest.submittedBy?.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.submittedBy.email}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted/50 p-1 rounded">
                    {formatAddress(selectedRequest.submittedBy?.address || "")}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      copyText(
                        selectedRequest.submittedBy?.address,
                        "publisher-address",
                      )
                    }
                    className="h-6 w-6"
                  >
                    {copiedKeyId === "publisher-address" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-medium">Approver</h3>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted/50 p-1 rounded flex-1 truncate">
                    {selectedRequest.approver}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      copyText(selectedRequest.approver, "approver-address")
                    }
                    className="h-6 w-6"
                  >
                    {copiedKeyId === "approver-address" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">Dispute Resolver</h3>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted/50 p-1 rounded flex-1 truncate">
                    {selectedRequest.disputeResolver}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      copyText(
                        selectedRequest.disputeResolver,
                        "resolver-address",
                      )
                    }
                    className="h-6 w-6"
                  >
                    {copiedKeyId === "resolver-address" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Release Signer</h3>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted/50 p-1 rounded flex-1 truncate">
                    {selectedRequest.releaseSigner}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      copyText(selectedRequest.releaseSigner, "signer-address")
                    }
                    className="h-6 w-6"
                  >
                    {copiedKeyId === "signer-address" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-6 border-t bg-muted/30">
          <div className="flex justify-end">
            <Button
              className="bg-gradient-to-r from-emerald-600 to-teal-900 hover:from-emerald-700 hover:to-teal-600 text-white px-6"
              onClick={() => {
                handleClose();
                setTimeout(() => {
                  if (selectedRequest) {
                    const offerId = selectedRequest.id;
                    if (offerId) {
                      const button = document.createElement("button");
                      button.style.display = "none";
                      button.onclick = () => {
                        handleClose();
                      };
                      document.body.appendChild(button);
                      button.click();
                      document.body.removeChild(button);
                    }
                  }
                }, 100);
              }}
            >
              Approve Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanRequestDetailDialog;
