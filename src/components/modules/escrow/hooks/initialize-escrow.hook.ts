/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "@/hooks/toast.hook";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowBoundedStore } from "../store/ui";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import {
  useInitializeEscrow as useInitializeEscrowHook,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import type {
  InitializeEscrowResponse,
  Trustline,
} from "@trustless-work/escrow/types";
import { signTransaction } from "@stellar/freighter-api";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { formSchema } from "../schema/initialize-escrow.schema";
import { trustlines } from "@/lib/trustlines";

export const useInitializeEscrow = () => {
  const [showSelect, setShowSelect] = useState({
    approver: false,
    serviceProvider: false,
    receiver: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
  });

  const { address } = useGlobalAuthenticationStore();
  const addEscrow = useGlobalBoundedStore((state) => state.addEscrow);
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);
  const setCurrentStep = useEscrowBoundedStore((state) => state.setCurrentStep);
  const router = useRouter();
  const setIsSuccessDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const resetSteps = useGlobalUIBoundedStore((state) => state.resetSteps);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const users = useGlobalAuthenticationStore((state) => state.users);

  const { deployEscrow, isPending: isDeploying } = useInitializeEscrowHook();
  const { sendTransaction, isPending: isSending } = useSendTransaction();
  const isSendingTransaction = isDeploying || isSending;

  const trustlinesOptions = trustlines.map(
    (trustline: Trustline & { name?: string }) => ({
      value: trustline.address,
      label: trustline.name,
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    defaultValues: {
      signer: address || "",
      engagementId: "",
      title: "",
      description: "",
      amount: "",
      platformFee: "2",
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

  const milestones = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some(
    (milestone) => milestone.description === "",
  );

  const handleAddMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = [...currentMilestones, { description: "" }];
    //form.setValue("milestones", updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
    form.setValue("milestones", updatedMilestones);
  };

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setIsSuccessDialogOpen(false);

    try {
      const { unsignedTransaction } = await deployEscrow(payload);

      if (!unsignedTransaction) {
        throw new Error("Unsigned transaction is missing.");
      }

      const { signedTxXdr } = await signTransaction(unsignedTransaction, {
        address: address,
        networkPassphrase: WalletNetwork.TESTNET,
      });

      if (!signedTxXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const data = (await sendTransaction({
        signedXdr: signedTxXdr,
        returnEscrowDataIsRequired: true,
      })) as InitializeEscrowResponse;

      if (data.status === "SUCCESS") {
        setIsSuccessDialogOpen(true);

        //if (loggedUser?.saveEscrow && data.escrow) {
        // await addEscrow(
        // {
        //  ...data.escrow,
        //  platformFee: trustlinesOptions..toString(),
        // },
        //  address,
        //    data.contractId,
        //  );
        // }

        //setRecentEscrow({
        //  ...data.escrow,
        //  contractId: data.contractId,
        //});

        resetSteps();
        setCurrentStep(1);
        form.reset();
        router.push("/dashboard/loans");
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions = useMemo(() => {
    const options = users.map((user) => ({
      value: user.address,
      label: `${user.firstName} ${user.lastName}`,
    }));
    return [{ value: "", label: "Select an User" }, ...options];
  }, [users]);

  const toggleField = (field: string, value: boolean) => {
    setShowSelect((prev) => ({ ...prev, [field]: value }));
  };

  return {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    trustlinesOptions,
    userOptions,
    showSelect,
    toggleField,
    isAnyMilestoneEmpty,
    isSendingTransaction,
  };
};
