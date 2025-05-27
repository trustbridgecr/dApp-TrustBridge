import { isValidWallet } from "@/helpers/is-valid-wallet.helper";
import { z } from "zod";

export const formSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  milestoneIndex: z.string().min(1, "Milestone index is required"),
  newFlag: z.boolean(),
  approver: z
    .string()
    .min(1, {
      message: "Approver is required.",
    })
    .refine((value) => isValidWallet(value), {
      message: "Approver must be a valid wallet.",
    }),
});
