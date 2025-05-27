import { isValidWallet } from "@/helpers/is-valid-wallet.helper";
import { z } from "zod";

export const formSchema = z.object({
  contractId: z.string().min(1, {
    message: "Contract ID is required.",
  }),
  signer: z.string().min(1, {
    message: "Signer is required.",
  }),
  escrow: z.object({
    title: z.string().min(1, {
      message: "Title is required.",
    }),
    engagementId: z.string().min(1, {
      message: "Engagement is required.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters long.",
    }),
    amount: z.string().min(1, {
      message: "Amount is required.",
    }),
    platformFee: z.string().min(1, {
      message: "Platform fee is required.",
    }),
    receiverMemo: z.number().min(0, {
      message: "Receiver memo must be a non-negative number.",
    }),
    roles: z.object({
      approver: z
        .string()
        .min(1, {
          message: "Approver is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Approver must be a valid wallet.",
        }),
      serviceProvider: z
        .string()
        .min(1, {
          message: "Service provider is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Service provider must be a valid wallet.",
        }),
      platformAddress: z
        .string()
        .min(1, {
          message: "Platform address is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Platform address must be a valid wallet.",
        }),
      releaseSigner: z
        .string()
        .min(1, {
          message: "Release signer is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Release signer must be a valid wallet.",
        }),
      disputeResolver: z
        .string()
        .min(1, {
          message: "Dispute resolver is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Dispute resolver must be a valid wallet.",
        }),
      receiver: z
        .string()
        .min(1, {
          message: "Receiver address is required.",
        })
        .refine((value) => isValidWallet(value), {
          message: "Receiver address must be a valid wallet.",
        }),
    }),
    trustline: z.object({
      address: z.string().min(1, {
        message: "Trustline address is required.",
      }),
      decimals: z.number().default(10000000),
    }),
    milestones: z
      .array(
        z.object({
          description: z.string().min(1, {
            message: "Milestone description is required.",
          }),
          status: z.string().default("pending"),
          evidence: z.string().default(""),
          approvedFlag: z.boolean().default(false),
        }),
      )
      .min(1, { message: "At least one milestone is required." }),
  }),
});
