"use client";

import { useState, useEffect, useCallback } from "react";
import type { Escrow } from "@/@types/escrow.entity";
import { getAllEscrowsByUser } from "../server/escrow.firebase";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import { toast } from "sonner";

export function useApproveEscrow() {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const fetchEscrows = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const response = await getAllEscrowsByUser({
        address,
        type: "approver",
      });

      if (response.data) {
        const pendingApprovalEscrows = response.data.filter((escrow: Escrow) =>
          escrow.milestones.some((milestone) => milestone.flag === false),
        );
        setEscrows(pendingApprovalEscrows);
      } else {
        toast.error("Failed to fetch escrows", {
          description:
            response.message || "An error occurred while fetching escrows.",
        });
      }
    } catch (error) {
      console.error("Error fetching escrows:", error);
      toast.error("Error", {
        description: "Failed to fetch escrows. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEscrows = useCallback(async () => {
    try {
      const { address } = await kit.getAddress();
      fetchEscrows(address);
    } catch (error) {
      console.error("Failed to refresh escrows:", error);
      toast.error("Refresh Failed", {
        description: "Could not refresh escrows. Please try again.",
      });
    }
  }, [fetchEscrows]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { address } = await kit.getAddress();
        if (address) {
          setAddress(address);
        }
        fetchEscrows(address);
      } catch (error) {
        console.error("Failed to get wallet address:", error);
        toast.error("Wallet Error", {
          description:
            "Could not get wallet address. Please make sure your wallet is connected.",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchEscrows]);

  const handleApproveClick = (escrow: Escrow, milestoneIndex: string) => {
    setSelectedEscrow(escrow);
    setSelectedMilestoneIndex(milestoneIndex);
    setIsModalOpen(true);
  };

  return {
    escrows,
    loading,
    selectedEscrow,
    selectedMilestoneIndex,
    isModalOpen,
    approvalLoading,
    address,
    handleApproveClick,
    refreshEscrows,
    setIsModalOpen,
    setApprovalLoading,
  };
}
