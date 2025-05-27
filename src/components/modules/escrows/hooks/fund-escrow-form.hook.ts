import { useEscrowContext } from "@/providers/escrow.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "../schemas/fund-escrow-form.schema";
import { toast } from "sonner";
import { signTransaction } from "../../auth/helpers/stellar-wallet-kit.helper";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  useFundEscrow,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  Escrow,
  EscrowRequestResponse,
  FundEscrowPayload,
} from "@trustless-work/escrow/types";

export const useFundEscrowForm = () => {
  const { escrow } = useEscrowContext();
  const { setEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fundEscrow } = useFundEscrow();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      amount: escrow?.amount?.toString() || "1000",
      signer: walletAddress || "Connect your wallet to get your address",
    },
  });

  const onSubmit = async (payload: FundEscrowPayload) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { unsignedTransaction } = await fundEscrow(payload);

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from fundEscrow response."
        );
      }

      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const data = await sendTransaction({
        signedXdr,
        returnEscrowDataIsRequired: false,
      });

      if (data.status === "SUCCESS" && escrow) {
        const escrowUpdated: Escrow = {
          ...escrow,
          balance:
            escrow?.balance && Number(escrow.balance) > 0
              ? (Number(escrow.balance) + Number(payload.amount)).toString()
              : payload.amount,
        };

        setEscrow(escrowUpdated);

        toast.success("Escrow Funded");
        setResponse(data);
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

  return { form, loading, response, error, onSubmit };
};
