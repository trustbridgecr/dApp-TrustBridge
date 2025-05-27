import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schemas/initialize-escrow-form.schema";
import { toast } from "sonner";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { trustlines } from "../constants/trustline.constant";
import { z } from "zod";
import { Resolver } from "react-hook-form";
import { steps } from "../constants/initialize-steps.constant";
import { buildEscrowFromResponse } from "../../../../helpers/build-escrow-from-response.helper";
import { signTransaction } from "../../auth/helpers/stellar-wallet-kit.helper";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  useInitializeEscrow as useInitializeEscrowHook,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  InitializeEscrowPayload,
  InitializeEscrowResponse,
  Trustline,
} from "@trustless-work/escrow/types";

type FormValues = z.infer<typeof formSchema>;

export const useInitializeEscrow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<InitializeEscrowResponse | null>(
    null
  );
  const { walletAddress } = useWalletContext();
  const { setEscrow } = useEscrowContext();
  const { setActiveTab } = useTabsContext();

  const { deployEscrow } = useInitializeEscrowHook();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      signer: walletAddress || "",
      engagementId: "",
      title: "",
      description: "",
      amount: "",
      platformFee: "",
      receiverMemo: 0,
      roles: {
        approver: "",
        serviceProvider: "",
        platformAddress: "",
        releaseSigner: "",
        disputeResolver: "",
        receiver: "",
      },
      trustline: {
        address: "",
        decimals: 10000000,
      },
      milestones: [
        {
          description: "",
          status: "pending",
          evidence: "",
          approvedFlag: false,
        },
      ],
    },
    mode: "onChange",
  });

  const trustlinesOptions = trustlines.map(
    (trustline: Trustline & { name?: string }) => ({
      value: trustline.address,
      label: trustline.name,
    })
  );

  const addMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    form.setValue("milestones", [
      ...currentMilestones,
      { description: "", status: "pending", evidence: "", approvedFlag: false },
    ]);
  };

  const removeMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    if (currentMilestones.length > 1) {
      form.setValue(
        "milestones",
        currentMilestones.filter((_, i) => i !== index)
      );
    }
  };

  const loadTemplate = () => {
    form.setValue("title", "Sample TW Escrow");
    form.setValue(
      "description",
      "This is a sample TW escrow for testing purposes"
    );
    form.setValue("engagementId", "ENG12345");
    form.setValue("amount", "50");
    form.setValue("platformFee", "5");
    form.setValue("roles.approver", walletAddress || "");
    form.setValue("roles.serviceProvider", walletAddress || "");
    form.setValue("roles.platformAddress", walletAddress || "");
    form.setValue("roles.releaseSigner", walletAddress || "");
    form.setValue("roles.disputeResolver", walletAddress || "");
    form.setValue("roles.receiver", walletAddress || "");
    form.setValue("receiverMemo", 90909090);
    form.setValue(
      "trustline.address",
      trustlines.find((t) => t.name === "USDC")?.address || ""
    );
    form.setValue("milestones", [
      {
        description: "Initial milestone",
        status: "pending",
        evidence: "",
        approvedFlag: false,
      },
      {
        description: "Second milestone",
        status: "pending",
        evidence: "",
        approvedFlag: false,
      },
      {
        description: "Final milestone",
        status: "pending",
        evidence: "",
        approvedFlag: false,
      },
    ]);
  };

  const onSubmit = async (payload: InitializeEscrowPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      // This is the final payload that will be sent to the API
      const finalPayload: InitializeEscrowPayload = {
        ...payload,
        receiverMemo: payload.receiverMemo ?? 0,
        signer: walletAddress || "",
      };

      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the deployEscrow function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await deployEscrow(finalPayload);

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from deployEscrow response."
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
       * - Escrow created successfully
       * - Set the escrow in the context
       * - Set the active tab to "escrow"
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data && data.status === "SUCCESS") {
        const escrow = buildEscrowFromResponse(
          data as InitializeEscrowResponse,
          walletAddress || ""
        );
        setEscrow(escrow);
        setActiveTab("escrow");
        toast.success("Escrow Created");
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

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepFields = (
    step: number
  ): (keyof z.infer<typeof formSchema>)[] => {
    switch (step) {
      case 0:
        return ["title", "engagementId", "description"];
      case 1:
        return ["amount", "platformFee", "trustline", "receiverMemo"];
      case 2:
        return ["roles"];
      case 3:
        return ["milestones"];
      default:
        return [];
    }
  };

  return {
    form,
    loading,
    response,
    trustlinesOptions,
    currentStep,
    addMilestone,
    removeMilestone,
    loadTemplate,
    onSubmit,
    nextStep,
    prevStep,
  };
};
