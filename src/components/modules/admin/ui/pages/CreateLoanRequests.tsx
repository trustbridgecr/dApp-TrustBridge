"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, User, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllLoanOffers,
  approveLoanOffer,
} from "@/components/modules/dashboard/offer/server/offer.firebase";
import LoanRequestDetailDialog from "@/components/modules/dashboard/offer/ui/dialogs/LoanRequestDetailDialog";
import { toast } from "sonner";

export default function LoanOfferRequests() {
  const [loanOffers, setLoanOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const res = await getAllLoanOffers({ status: "pending" });
      if (res.success && res.data) setLoanOffers(res.data);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return "Unknown address";
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const formatDate = (seconds: number) => {
    if (!seconds) return "Unknown date";
    return format(new Date(seconds * 1000), "dd/MM/yyyy | HH:mm");
  };

  const handleApprove = async (offerId: string) => {
    const res = await approveLoanOffer({ offerId });
    if (res.success) {
      toast.success("Offer approved");
      setLoanOffers((prev) => prev.filter((o) => o.id !== offerId));
    } else {
      toast.error("Failed to approve offer");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold">Loan Offer Requests</h1>
          <p className="text-muted-foreground">
            These loan offers are pending approval. You can review and approve
            them to publish in the marketplace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold">Loan Offer Requests</h1>
        <p className="text-muted-foreground">
          These loan offers are pending approval. You can review and approve
          them to publish in the marketplace.
        </p>
      </div>

      {loanOffers.length === 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No pending offers</h3>
            <p className="text-muted-foreground text-center">
              There are currently no loan offers pending approval.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loanOffers.map((offer) => (
          <Card
            key={offer.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              setSelectedRequest(offer);
              setIsDialogOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold truncate">
                  {offer.title}
                </h3>
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-600 bg-yellow-50"
                >
                  Pending
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <User className="h-4 w-4" />
                <p className="truncate">{formatAddress(offer.lenderWallet)}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="bg-muted/30 rounded-full p-1">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-medium text-xl">${offer.maxAmount}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created:</span>
                  </div>
                  <span>
                    {offer.createdAt?.seconds &&
                      formatDate(offer.createdAt.seconds)}
                  </span>
                </div>

                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(offer.id);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Offer
                </Button>
              </div>
            </CardContent>
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
