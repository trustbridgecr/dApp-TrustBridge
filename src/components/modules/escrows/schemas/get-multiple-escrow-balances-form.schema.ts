import { z } from "zod";

export const formSchema = z.object({
  signer: z.string().min(1, "Signer address is required"),
  addresses: z
    .array(
      z.object({
        value: z.string().min(1, "Address is required"),
      }),
    )
    .min(1, "At least one address is required"),
});
