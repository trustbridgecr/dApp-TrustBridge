import { z } from "zod";
import { useValidData } from "@/utils/hook/valid-data.hook";

export const GetOfferLoanSchema = () => {
  const { isValidWallet } = useValidData();

  return z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    maxAmount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Debe ser un número válido"),
    platformFee: z.literal("1.5", {
      errorMap: () => ({ message: "Platform fee es fijo en 1.5%" }),
    }),
    approver: z
      .string()
      .refine(isValidWallet, { message: "Wallet inválida (approver)" }),
    releaseSigner: z
      .string()
      .refine(isValidWallet, { message: "Wallet inválida (release signer)" }),
    disputeResolver: z
      .string()
      .refine(isValidWallet, { message: "Wallet inválida (dispute resolver)" }),
    platformAddress: z
      .string()
      .refine(isValidWallet, { message: "Wallet inválida (platform address)" }),
    milestones: z
      .array(
        z.object({
          description: z.string().min(3, "Descripción requerida"),
        }),
      )
      .min(1, "Debe haber al menos un requisito"),
  });
};

export const OfferLoanSchema = GetOfferLoanSchema();
export type OfferLoanSchemaType = z.infer<typeof OfferLoanSchema>;
