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
import {
  Copy,
  Check,
  DollarSign,
  Calendar,
  User,
  Shield,
  Gavel,
  Milestone,
  BadgeCheck,
} from "lucide-react";
import { useMarketplaceStore } from "../../store/marketplace";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApprovedLoan } from "../../store/marketplace";

interface MarketplaceLoanDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  selectedLoan?: ApprovedLoan;
  setSelectedLoan: (value?: ApprovedLoan) => void;
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
  };

  const handleRequestLoan = () => {
    if (selectedLoan) {
      setSelectedLoan(selectedLoan);
    }
    router.push("/dashboard/loans/loan-request");
  };

  if (!isDialogOpen || !selectedLoan) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-4xl rounded-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-900 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedLoan.title}
              </DialogTitle>
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30"
              >
                Available Loan
              </Badge>
            </div>
            <DialogDescription className="text-base text-white/90 mt-2">
              {selectedLoan.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent h-14 mb-2">
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
                      {formatDollar(selectedLoan.maxAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <BadgeCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Platform Fee
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedLoan.platformFee}%
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
                      {selectedLoan.platformAddress}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyText(
                          selectedLoan.platformAddress,
                          selectedLoan.platformAddress,
                        );
                      }}
                      className="h-8 w-8"
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Published At
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {formatDateFromFirebase(
                        selectedLoan.createdAt?.seconds ?? 0,
                        selectedLoan.createdAt?.nanoseconds ?? 0,
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
                <Milestone className="h-5 w-5 text-emerald-600" />
                <h3 className="font-medium">Loan Milestones</h3>
              </div>

              {(selectedLoan.milestones?.length ?? 0 > 0) ? (
                <div className="space-y-3">
                  {selectedLoan.milestones?.map((m, idx) => (
                    <div
                      key={idx}
                      className="border p-4 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 rounded-full p-1.5 mt-0.5">
                          <span className="text-xs font-bold text-emerald-700">
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
                  <h3 className="font-medium">Published By</h3>
                </div>
                <p className="text-base font-semibold">
                  {selectedLoan.submittedBy?.name || "Unknown"}
                </p>
                {selectedLoan.submittedBy?.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedLoan.submittedBy.email}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted/50 p-1 rounded">
                    {formatAddress(selectedLoan.submittedBy?.address || "")}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(
                        selectedLoan.submittedBy?.address,
                        "publisher-address",
                      );
                    }}
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
                    {selectedLoan.approver}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(selectedLoan.approver, "approver-address");
                    }}
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
                    {selectedLoan.disputeResolver}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(
                        selectedLoan.disputeResolver,
                        "resolver-address",
                      );
                    }}
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
                    {selectedLoan.releaseSigner}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(selectedLoan.releaseSigner, "signer-address");
                    }}
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
              onClick={handleRequestLoan}
            >
              Apply for this Loan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceLoanDetailDialog;
