"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  User,
  MessageCircle,
  MapPin,
  Phone,
  CreditCard,
  Shield,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard.hook";

export function DashboardOverview() {
  const { loading, profile, address, walletName, chatCount } = useDashboard();

  if (loading) {
    return (
      <div className="p-6 space-y-6 pb-32">
        <Skeleton className="h-8 w-64 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-800 to-teal-500 rounded-full" />
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-muted-foreground pl-3 border-l-2 border-muted">
          Your account summary, wallet information, and activity overview.
        </p>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Information Card */}
        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-emerald-800 to-teal-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-emerald-800 rounded-full p-2">
                <Wallet className="h-5 w-5 text-emerald-800" />
              </div>
              Wallet Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Address
                </span>
                <div className="flex items-center gap-2">
                  {address ? (
                    <>
                      <Badge
                        variant="outline"
                        className="bg-emerald-800 text-emerald-800 border-emerald-800"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-mono text-sm break-all">
                  {formatAddress(address || "")}
                </p>
              </div>

              {walletName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Wallet Type
                  </span>
                  <span className="font-medium">{walletName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Profile Card */}
        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-800" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-teal-100 rounded-full p-2">
                <User className="h-5 w-5 text-teal-600" />
              </div>
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Full Name
                  </span>
                  <span className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Country
                  </span>
                  <span className="font-medium">{profile.country}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </span>
                  <span className="font-medium">{profile.phoneNumber}</span>
                </div>

                <div className="pt-2 mt-3 border-t">
                  <Badge
                    variant="outline"
                    className="bg-emerald-800 text-emerald-800 border-emerald-800"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Profile Complete
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  No profile data available
                </p>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  Setup Required
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary Card */}
        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-emerald-800 to-teal-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-emerald-800 rounded-full p-2">
                <Activity className="h-5 w-5 text-emerald-800" />
              </div>
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Total Chats
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-800">
                    {chatCount}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-800 to-teal-50 dark:from-emerald-800 dark:to-teal-950/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Chat Activity</span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-800 text-emerald-800 border-emerald-800"
                  >
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  You have participated in {chatCount} conversation
                  {chatCount !== 1 ? "s" : ""} on the platform.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-600">
                    {chatCount > 0 ? "100%" : "0%"}
                  </p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-800">
                    {chatCount > 5 ? "High" : chatCount > 0 ? "Medium" : "Low"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Activity Level
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Section */}
      {(profile || address) && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${address ? "bg-emerald-800" : "bg-amber-500"}`}
                />
                <div>
                  <p className="font-medium">Wallet Connection</p>
                  <p className="text-sm text-muted-foreground">
                    {address ? "Connected and verified" : "Not connected"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${profile ? "bg-emerald-800" : "bg-amber-500"}`}
                />
                <div>
                  <p className="font-medium">Profile Setup</p>
                  <p className="text-sm text-muted-foreground">
                    {profile
                      ? "Complete profile information"
                      : "Profile setup required"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${chatCount > 0 ? "bg-emerald-800" : "bg-gray-400"}`}
                />
                <div>
                  <p className="font-medium">Platform Activity</p>
                  <p className="text-sm text-muted-foreground">
                    {chatCount > 0 ? "Active participant" : "New to platform"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
