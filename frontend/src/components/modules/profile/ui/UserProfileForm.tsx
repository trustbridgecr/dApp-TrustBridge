"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useUserContext } from "@/providers/user.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { toast } from "sonner";
import { profileSchema } from "../schemas/profile.schema";

export default function Profile() {
  const { profile, loading, saving, saveProfile } = useUserContext();
  const { walletAddress } = useWalletContext();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      phoneNumber: "",
      walletAddress: "",
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        country: profile.country || "",
        phoneNumber: profile.phoneNumber || "",
        walletAddress: walletAddress || profile.walletAddress || "",
      });
    } else if (walletAddress) {
      form.reset({
        // Keep any potentially user-entered values if profile is null
        ...form.getValues(),
        walletAddress: walletAddress,
      });
    }
  }, [profile, walletAddress, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await saveProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-3xl">
        <div className="flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
      <p className="text-gray-400 mb-8">
        Keep your information up-to-date for the best experience on TrustBridge.
      </p>

      <form onSubmit={handleSaveChanges}>
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-medium mb-4 border-b border-custom pb-3">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first-name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                className="form-input"
                placeholder="Enter your first name"
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p className="text-red-400 text-xs mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last-name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                className="form-input"
                placeholder="Enter your last name"
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p className="text-red-400 text-xs mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-medium mb-4 border-b border-custom pb-3">
            Contact & Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <select
                id="country"
                className="form-select"
                {...form.register("country")}
              >
                <option value="" disabled>
                  Select your country
                </option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="es">Spain</option>
                <option value="it">Italy</option>
                <option value="mx">Mexico</option>
                <option value="br">Brazil</option>
                <option value="ar">Argentina</option>
                <option value="co">Colombia</option>
                <option value="pe">Peru</option>
                <option value="cl">Chile</option>
              </select>
              {form.formState.errors.country && (
                <p className="text-red-400 text-xs mt-1">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                placeholder="Enter your phone number"
                {...form.register("phoneNumber")}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-medium mb-4 border-b border-custom pb-3">
            Wallet Details
          </h2>
          <div>
            <label htmlFor="wallet-address" className="form-label">
              Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="wallet-address"
                className="form-input bg-dark-tertiary opacity-70"
                value={walletAddress || form.getValues("walletAddress") || ""}
                readOnly
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <i className="fas fa-lock"></i>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your wallet address cannot be edited and is linked to your
              account.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="btn-primary px-8 py-3 text-base"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="loader mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
