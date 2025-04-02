"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OfferLoanSchema,
  OfferLoanSchemaType,
} from "../schema/apply-loan.schema";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { addLoanOffer } from "../server/offer.firebase";
import { toast } from "sonner";

export function useOfferLoanForm() {
  const { address, loggedUser } = useGlobalAuthenticationStore();
  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);

  const form = useForm<OfferLoanSchemaType>({
    resolver: zodResolver(OfferLoanSchema),
    defaultValues: {
      title: "",
      description: "",
      maxAmount: "",
      platformFee: "1.5",
      approver: "",
      releaseSigner: "",
      disputeResolver: "",
      platformAddress:
        "GBZ7KCIUGD2ME7J7YSQW6WVM2RRNYA3AQWVEKVM2VK5LMQL3CKYARBWX",
      milestones: [{ description: "" }],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!address || !loggedUser) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...values,
      submittedBy: {
        address,
        name: `${loggedUser.firstName} ${loggedUser.lastName}`,
        email: loggedUser.email || "",
      },
    };

    const response = await addLoanOffer({
      payload,
      lenderWallet: address,
    });

    if (response.success) {
      toast.success("Loan offer submitted!");
      form.reset();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  });

  return { form, fieldArray, onSubmit };
}
