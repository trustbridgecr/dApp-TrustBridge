"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  maxAmount: z.string().min(1, "Max amount is required"),
  description: z.string().min(1, "Description is required"),
  approver: z.string().min(1, "Approver address is required"),
  releaseSigner: z.string().min(1, "Release signer address is required"),
  platformAddress: z.string().min(1, "Platform address is required"),
  disputeResolver: z.string().optional(),
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, "Milestone description is required"),
      }),
    )
    .min(1, "At least one milestone is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function useOfferLoanForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      maxAmount: "",
      description: "",
      approver: "",
      releaseSigner: "",
      platformAddress: "",
      disputeResolver: "",
      milestones: [],
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      console.log("Form submitted:", data);
      alert("Form submitted successfully!");
    },
    (errors) => {
      console.log("Form errors:", errors);
    },
  );

  return { form, fieldArray, onSubmit };
}
