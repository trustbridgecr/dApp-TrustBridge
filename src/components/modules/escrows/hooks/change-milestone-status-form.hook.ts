import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "../schemas/change-milestone-status-form.schema";
import { toast } from "sonner";
import { useWalletContext } from "@/providers/wallet.provider";
import { signTransaction } from "../../auth/helpers/stellar-wallet-kit.helper";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import {
  useChangeMilestoneStatus,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  ChangeMilestoneStatusPayload,
  Escrow,
  EscrowRequestResponse,
  Milestone,
} from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/providers/escrow.provider";
import { WalletError } from "@/@types/errors.entity";

export const useChangeMilestoneStatusForm = () => {
  const { escrow } = useEscrowContext();
  const { setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const { walletAddress } = useWalletContext();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { sendTransaction } = useSendTransaction();

  const milestones = escrow?.milestones || [
    { description: "Initial setup", status: "pending" },
    { description: "Development phase", status: "pending" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      milestoneIndex: "",
      newStatus: "",
      evidence: "",
      serviceProvider: escrow?.roles.serviceProvider || "",
    },
  });

  const onSubmit = async (payload: ChangeMilestoneStatusPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the changeMilestoneStatus function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await changeMilestoneStatus(payload);

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from changeMilestoneStatus response.",
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
        returnEscrowDataIsRequired: false,
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
          milestones: escrow!.milestones.map((milestone: Milestone, index) =>
            index === Number(payload.milestoneIndex)
              ? {
                  ...milestone,
                  status: payload.newStatus,
                  evidence: payload.evidence || "",
                }
              : milestone,
          ),
        };

        setEscrow(escrowUpdated);

        toast.success(
          `Milestone index - ${payload.milestoneIndex} updated to ${payload.newStatus}`,
        );
        setResponse(data);
        form.reset();
      }
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, milestones, loading, response, onSubmit };
};
