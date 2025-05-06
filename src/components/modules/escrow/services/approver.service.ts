import type { ChangeMilestoneFlagPayload } from "@/@types/escrow.entity";
import { changeMilestoneFlag } from "./change-mileston-flag.service";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";

type ChangeMilestoneFlagResult = {
  success: boolean;
  message?: string;
  transactionHash?: string;
};

export const approveMilestone = async (
  payload: Omit<ChangeMilestoneFlagPayload, "approver">,
): Promise<ChangeMilestoneFlagResult> => {
  try {
    const { address } = await kit.getAddress();

    const completePayload: ChangeMilestoneFlagPayload = {
      ...payload,
      approver: address,
    };

    const result = await changeMilestoneFlag(completePayload);
    return result;
  } catch (error) {
    console.error("Error in approveMilestone:", error);
    throw error;
  }
};
