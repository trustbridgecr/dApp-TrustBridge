"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useUserContext } from "@/providers/user.provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  User,
  MapPin,
  Phone,
  Wallet,
  FlaskConical,
  Save,
} from "lucide-react";
import { profileSchema } from "../schemas/profile.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useWalletContext } from "@/providers/wallet.provider";
import { toast } from "sonner";

export default function UserProfilePage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-neutral-900">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-900 text-neutral-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="bg-neutral-800 border-neutral-700 shadow-xl">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-7 w-7 text-emerald-400" />
                  <CardTitle className="text-xl font-semibold text-neutral-100">
                    Your Profile
                  </CardTitle>
                </div>
                <CardDescription className="text-neutral-400">
                  Keep your information up-to-date for the best experience on
                  TrustBridge.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <h3 className="text-md font-semibold text-emerald-400 border-b border-neutral-700 pb-2 mb-4">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300 flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" /> First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. John"
                              {...field}
                              className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300 flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" /> Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Doe"
                              {...field}
                              className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact & Location Section */}
                <div className="space-y-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <h3 className="text-md font-semibold text-emerald-400 border-b border-neutral-700 pb-2 mb-4">
                    Contact & Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300 flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" /> Country
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-neutral-100 focus:ring-emerald-500 focus:border-emerald-500">
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                              {[
                                { value: "us", label: "United States" },
                                { value: "ca", label: "Canada" },
                                { value: "uk", label: "United Kingdom" },
                                { value: "de", label: "Germany" },
                                { value: "fr", label: "France" },
                                { value: "es", label: "Spain" },
                                { value: "it", label: "Italy" },
                                { value: "mx", label: "Mexico" },
                                { value: "br", label: "Brazil" },
                                { value: "ar", label: "Argentina" },
                              ].map((country) => (
                                <SelectItem
                                  key={country.value}
                                  value={country.value}
                                  className="focus:bg-neutral-700"
                                >
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300 flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              {...field}
                              className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Wallet Address Section */}
                <div className="space-y-2 p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <h3 className="text-md font-semibold text-emerald-400 border-b border-neutral-700 pb-2 mb-3">
                    Wallet Details
                  </h3>
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-300 flex items-center gap-2 text-sm">
                          <Wallet className="h-4 w-4" /> Wallet Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            {...field}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-400 cursor-not-allowed"
                          />
                        </FormControl>
                        <p className="text-xs text-neutral-500 mt-1">
                          This address is linked to your account and cannot be
                          changed here.
                        </p>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardFooter className="p-6 border-t border-neutral-700">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-base"
                >
                  {saving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
