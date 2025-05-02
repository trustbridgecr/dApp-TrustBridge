"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  DollarSign,
  User,
  CheckCircle,
  Calendar,
  Milestone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoanRequestDetailDialog from "@/components/modules/dashboard/offer/ui/dialogs/LoanRequestDetailDialog";
import { useLoanOfferRequests } from "../../hooks/useLoanOfferRequests.hook";

export default function LoanOfferRequests() {
  const {
    loanOffers,
    loading,
    isDialogOpen,
    selectedRequest,
    formatAddress,
    formatDate,
    handleApprove,
    openRequestDetails,
    setIsDialogOpen,
    setSelectedRequest,
  } = useLoanOfferRequests();

  if (loading) {
    return (
      <div className="p-6 md:p-8 mb-6 lex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden border-muted">
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-8 w-24 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex mb-6 flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          <h1 className="text-3xl font-bold">Loan Offer Requests</h1>
        </div>
        <p className="text-muted-foreground pl-3 border-l-2 border-muted">
          These loan offers are pending approval. Review and approve them to
          publish in the marketplace.
        </p>
      </div>

      {loanOffers.length === 0 && (
        <Card className="overflow-hidden border-muted">
          <CardContent className="p-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No pending offers</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no loan offers pending approval. When lenders
              submit new offers, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loanOffers.map((offer) => (
          <Card
            key={offer.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-muted"
            onClick={() => openRequestDetails(offer)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-200 bg-amber-50"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {offer.createdAt?.seconds &&
                    formatDate(offer.createdAt.seconds)}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {offer.title}
              </h3>

              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <User className="h-4 w-4" />
                <p className="truncate">{formatAddress(offer.lenderWallet)}</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 rounded-full p-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                  <p className="font-bold text-xl">${offer.maxAmount}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {offer.milestones?.length > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded-full">
                    <Milestone className="h-3 w-3" />
                    <span>
                      {offer.milestones.length} milestone
                      {offer.milestones.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {offer.platformFee && (
                  <div className="flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span>{offer.platformFee}% fee</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className={cn(
                  "w-full flex items-center justify-center gap-2 transition-all",
                  "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-900 hover:to-teal-600",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(offer.id);
                }}
              >
                <CheckCircle className="h-4 w-4" />
                Approve Offer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <LoanRequestDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
      />
    </div>
  );
}
