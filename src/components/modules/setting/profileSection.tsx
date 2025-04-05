"use client";

import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useProfile from "./hooks/profile-section.hook";
import { UserPayload } from "@/@types/user.entity";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { Calendar, Camera, Info, Trash2, Upload, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileSectionProps {
  onSave: (data: UserPayload) => void;
}

const ProfileSection = ({ onSave }: ProfileSectionProps) => {
  const { form, onSubmit, handleProfileImageUpload, handleProfileImageDelete } =
    useProfile({
      onSave,
    });
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const { formatDateFromFirebase } = useFormatUtils();
  const [userData, setUserData] = useState<UserPayload | null>(null);

  useEffect(() => {
    if (loggedUser) {
      setUserData(loggedUser);
    }
  }, [loggedUser]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>
      <p className="text-muted-foreground pl-3 border-l-2 border-muted">
        Manage your personal details, update preferences, and customize your
        experience here.
      </p>
      <Card className="overflow-hidden  border-border shadow-sm mb-20">
        <CardHeader className="pb-0 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage
                    className="object-cover"
                    src={userData?.profileImage || loggedUser?.profileImage}
                    alt={userData?.firstName || loggedUser?.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 text-xl">
                    {userData?.firstName?.charAt(0) || "?"}{" "}
                    {userData?.lastName?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>

                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="h-6 w-6" />
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfileImageUpload(file);
                    }}
                  />
                </label>

                {userData?.profileImage && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleProfileImageDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {userData?.firstName || loggedUser?.firstName}{" "}
                  {userData?.lastName || loggedUser?.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {userData?.email || loggedUser?.email || "No email provided"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <User className="h-3 w-3 mr-1" />
                    Account
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Joined{" "}
                    {formatDateFromFirebase(
                      userData?.createdAt?.seconds ?? 0,
                      userData?.createdAt?.nanoseconds ?? 0,
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-emerald-600" />
                      Personal Information
                    </h3>
                    <div className="h-px bg-border" />
                  </div>

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="identification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identification</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your ID"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center">
                      <Info className="h-4 w-4 mr-2 text-teal-600" />
                      Contact Details
                    </h3>
                    <div className="h-px bg-border" />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your country"
                            {...field}
                            className="border-muted focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-8"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
