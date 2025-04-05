"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getAllLoanOffers,
  approveLoanOffer,
} from "@/components/modules/dashboard/offer/server/offer.firebase";

interface LoanOffer {
  id: string;
  borrower: string;
  amount: number;
  status: string;
  createdAt: number;
}

interface LoanOfferRequest {
  id: string;
  borrower: string;
  amount: number;
  status: string;
  createdAt: number;
}

export function useLoanOfferRequests() {
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<
    LoanOfferRequest | undefined
  >(undefined);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const res = await getAllLoanOffers({ status: "pending" });
    if (res.success && res.data) setLoanOffers(res.data);
    setLoading(false);
  };

  const formatAddress = (address: string): string => {
    if (!address) return "Unknown address";
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const formatDate = (seconds: number): string => {
    if (!seconds) return "Unknown date";
    return format(new Date(seconds * 1000), "dd/MM/yyyy | HH:mm");
  };

  const handleApprove = async (offerId: string): Promise<void> => {
    try {
      const res = await approveLoanOffer({ offerId });
      if (res.success) {
        toast.success("Offer approved successfully");
        setLoanOffers((prev) => prev.filter((o) => o.id !== offerId));
      } else {
        toast.error("Failed to approve offer");
      }
    } catch (error) {
      toast.error("An error occurred while approving the offer");
    }
  };

  const openRequestDetails = (request: LoanOfferRequest): void => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const closeRequestDetails = (): void => {
    setIsDialogOpen(false);
    setSelectedRequest(undefined);
  };

  return {
    loanOffers,
    loading,
    isDialogOpen,
    selectedRequest,
    formatAddress,
    formatDate,
    handleApprove,
    openRequestDetails,
    closeRequestDetails,
    setIsDialogOpen,
    setSelectedRequest,
  };
}
