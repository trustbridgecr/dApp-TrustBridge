"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserProfile } from "@/components/modules/profile/hooks/use-user-profile.hook";
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
import { Loader2, User, MapPin, Phone, Wallet } from "lucide-react";
import { profileSchema } from "../schemas/profile.schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type FormValues = z.infer<typeof profileSchema>;

export const UserProfileForm = () => {
  const { profile, loading, saving, saveProfile } = useUserProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      country: profile?.country || "",
      phoneNumber: profile?.phoneNumber || "",
      walletAddress: profile?.walletAddress || "",
    },
  });

  // Update form values when profile loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        country: profile.country || "",
        phoneNumber: profile.phoneNumber || "",
        walletAddress: profile.walletAddress || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: FormValues) => {
    await saveProfile(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 mt-10 w-full bg-background min-h-screen">
      <div className="flex-1 flex flex-col bg-background max-w-4xl mx-auto">
        <Card className="m-4 mb-0">
          <CardHeader className="pb-3">
            {/* Progress Bar */}
            <div className="w-full bg-primary rounded-full h-1 mb-8">
              <div className="bg-emerald-600 h-1 rounded-full w-full"></div>
            </div>

            <h1 className="text-3xl font-bold mb-2">User Registration</h1>
            <p className="text-gray-400">
              Complete the information to create your profile on the platform
            </p>
          </CardHeader>

          <CardContent className="flex-1 p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <User className="h-4 w-4" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Country
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="us" className="text-white">
                            United States
                          </SelectItem>
                          <SelectItem
                            value="ca"
                            className="text-white hover:bg-gray-700"
                          >
                            Canada
                          </SelectItem>
                          <SelectItem
                            value="uk"
                            className="text-white hover:bg-gray-700"
                          >
                            United Kingdom
                          </SelectItem>
                          <SelectItem
                            value="de"
                            className="text-white hover:bg-gray-700"
                          >
                            Germany
                          </SelectItem>
                          <SelectItem
                            value="fr"
                            className="text-white hover:bg-gray-700"
                          >
                            France
                          </SelectItem>
                          <SelectItem
                            value="es"
                            className="text-white hover:bg-gray-700"
                          >
                            Spain
                          </SelectItem>
                          <SelectItem
                            value="it"
                            className="text-white hover:bg-gray-700"
                          >
                            Italy
                          </SelectItem>
                          <SelectItem
                            value="mx"
                            className="text-white hover:bg-gray-700"
                          >
                            Mexico
                          </SelectItem>
                          <SelectItem
                            value="br"
                            className="text-white hover:bg-gray-700"
                          >
                            Brazil
                          </SelectItem>
                          <SelectItem
                            value="ar"
                            className="text-white hover:bg-gray-700"
                          >
                            Argentina
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wallet */}
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Wallet
                      </FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <p className="text-sm text-gray-400 mt-1">
                        Your digital wallet address for transactions
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
