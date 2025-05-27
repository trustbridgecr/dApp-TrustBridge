/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { toast } from "sonner";
import { formSchema } from "../schemas/update-escrow-form.schema";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import { signTransaction } from "../../auth/helpers/stellar-wallet-kit.helper";
import {
  Escrow,
  UpdateEscrowPayload,
  UpdateEscrowResponse,
} from "@trustless-work/escrow/types";
import {
  useSendTransaction,
  useUpdateEscrow,
} from "@trustless-work/escrow/hooks";

export const useUpdateEscrowForm = () => {
  const { escrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const { setEscrow } = useEscrowContext();
  const [response, setResponse] = useState<UpdateEscrowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateEscrow } = useUpdateEscrow();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      signer: walletAddress || "",
      contractId: escrow?.contractId || "",
      escrow: {
        title: escrow?.title || "",
        engagementId: escrow?.engagementId || "",
        description: escrow?.description || "",
        amount: escrow?.amount.toString() || "",
        platformFee: (Number(escrow?.platformFee) / 100).toString() || "",
        receiverMemo: escrow?.receiverMemo || 0,
        roles: {
          approver: escrow?.roles.approver || "",
          serviceProvider: escrow?.roles.serviceProvider || "",
          platformAddress: escrow?.roles.platformAddress || "",
          releaseSigner: escrow?.roles.releaseSigner || "",
          disputeResolver: escrow?.roles.disputeResolver || "",
          receiver: escrow?.roles.receiver || "",
        },
        trustline: {
          address: escrow?.trustline.address || "",
          decimals: escrow?.trustline.decimals || 10000000,
        },
        milestones: escrow?.milestones || [
          {
            description: "",
            status: "pending",
            evidence: "",
            approvedFlag: false,
          },
        ],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "escrow.milestones",
  });

  const onSubmit = async (payload: UpdateEscrowPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the updateEscrow function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await updateEscrow(payload);

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from updateEscrow response."
        );
      }

      /**
       * @Note:
       * - We need to sign the transaction using your private key
       * - The result will be a signed transaction
       */
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      /**
       * @Note:
       * - We need to send the signed transaction to the API
       * - The data will be an SendTransactionResponse
       */
      const data = await sendTransaction({
        signedXdr,
        returnEscrowDataIsRequired: true,
      });

      /**
       * @Responses:
       * data.status === "SUCCESS"
       * - Escrow updated successfully
       * - Set the escrow in the context
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data.status === "SUCCESS" && escrow) {
        const escrowUpdated: Escrow = {
          ...escrow,
          ...payload.escrow,
          signer: payload.signer,
          contractId: payload.contractId,
        };

        setEscrow(escrowUpdated);
        setResponse(data as UpdateEscrowResponse);
        toast.success("Escrow Updated");
      }
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, response, fields, append, remove, onSubmit };
};
