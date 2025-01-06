"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long.",
    })
    .max(30, {
      message: "Username cannot be more than 30 characters long.",
    }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long.",
    })
    .max(30, {
      message: "Name cannot be more than 30 characters long.",
    }),
  dob: z.string(),
  language: z.string({
    required_error: "Please select a language.",
  }),
});

const notificationsFormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const cryptoFormSchema = z.object({
  wallet_address: z
    .string()
    .min(26, { message: "Wallet address must be at least 26 characters long." })
    .max(35, { message: "Wallet address cannot be more than 35 characters long." }),
  preferred_currency: z.string({
    required_error: "Please select a preferred cryptocurrency.",
  }),
  auto_convert: z.boolean().default(false).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
export type CryptoFormValues = z.infer<typeof cryptoFormSchema>;

export function useSettingsForm() {
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "example bio",
      urls: [
        { value: "https://example.com" },
        { value: "https://example2.com" },
      ],
    },
    mode: "onChange",
  });

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      dob: "",
      language: "",
    },
    mode: "onChange",
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      marketing_emails: false,
      security_emails: true,
    },
  });

  const cryptoForm = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      wallet_address: "",
      preferred_currency: "",
      auto_convert: false,
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    // Logic for updating profile (removed toast)
  };

  const onAccountSubmit = (data: AccountFormValues) => {
    // Logic for updating account (removed toast)
  };

  const onNotificationsSubmit = (data: NotificationsFormValues) => {
    // Logic for updating notifications (removed toast)
  };

  const onCryptoSubmit = (data: CryptoFormValues) => {
    // Logic for updating crypto settings (removed toast)
  };

  return {
    activeTab,
    setActiveTab,
    profileForm,
    accountForm,
    notificationsForm,
    cryptoForm,
    onProfileSubmit,
    onAccountSubmit,
    onNotificationsSubmit,
    onCryptoSubmit,
  };
}
