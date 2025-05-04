"use client";

import { useState } from "react";
import { providerMilestone } from "../services/service-provider-milestone.service";
import { toast } from "sonner";

export const useMilestoneCompletion = (onSuccess: () => void) => {
  const [completing, setCompleting] = useState<boolean>(false);
  // const { signMessageAsync } = useSignMessage();

  const completeMilestone = async (escrowId: string, milestoneId: string) => {
    setCompleting(true);
    try {
      // Create a message to sign that contains the escrow and milestone IDs
      // const message = `Complete milestone ${milestoneId} for escrow ${escrowId}`;

      // Sign the message with the wallet
      // const signature = await signMessageAsync({ message });

      // Send the completion request to the API
      await providerMilestone.completeMilestone({
        escrowId,
        milestoneId,
        // signature,
      });

      toast.success("Milestone completed");
      onSuccess();
    } catch {
      toast.error("Failed to complete milestone");
    } finally {
      setCompleting(false);
    }
  };

  return { completeMilestone, completing };
};
