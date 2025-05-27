import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schemas/get-multiple-escrow-balances-form.schema";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  EscrowRequestResponse,
  GetBalanceParams,
} from "@trustless-work/escrow/types";
import { GetEscrowBalancesResponse } from "@trustless-work/escrow/types";
import { useGetMultipleEscrowBalances } from "@trustless-work/escrow/hooks";

type FormData = z.infer<typeof formSchema>;

export const useGetMultipleEscrowBalancesForm = () => {
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    EscrowRequestResponse | GetEscrowBalancesResponse[] | null
  >(null);
  const { getMultipleBalances, balances } = useGetMultipleEscrowBalances();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signer: walletAddress || "",
      addresses: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const onSubmit = async (payload: FormData) => {
    setLoading(true);
    setResponse(null);

    // Transform the payload to the correct format
    const transformedData: GetBalanceParams = {
      addresses: payload.addresses.map((a) => a.value),
      signer: payload.signer,
    };

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the getMultipleBalances function
       * - The result will be multiple escrow balances
       */
      await getMultipleBalances(transformedData);

      if (!balances) {
        throw new Error("Escrow not found");
      }

      /**
       * @Responses:
       * balances !== null
       * - Escrow balances received successfully
       * - Set the response
       * - Show a success toast
       *
       * balances === null
       * - Show an error toast
       */
      if (balances) {
        setResponse(balances);
        toast.success("Escrow Balances Received");
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
