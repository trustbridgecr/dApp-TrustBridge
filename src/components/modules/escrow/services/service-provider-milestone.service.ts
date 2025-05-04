import http from "@/core/config/axios/http";
import axios from "axios";

export interface Escrow {
  id: string;
  title: string;
  status: string;
  client: string;
  totalAmount: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: "pending" | "complete" | "cancelled";
  dueDate: string;
}

export interface CompleteMilestonePayload {
  escrowId?: string;
  milestoneId?: string;
  signature?: string;
}

export const providerMilestone = {
  // Get escrows for the current provider
  getProviderEscrows: async (providerAddress: string): Promise<Escrow[]> => {
    try {
      const response = await http.get(`/escrow/provider/${providerAddress}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "Failed to fetch provider escrows",
        );
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred while fetching escrows");
      }
    }
  },

  // Mark a milestone as complete
  completeMilestone: async (
    payload: CompleteMilestonePayload,
  ): Promise<void> => {
    try {
      await http.post("/milestone/complete", payload);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "Failed to complete milestone",
        );
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred while completing milestone");
      }
    }
  },
};
