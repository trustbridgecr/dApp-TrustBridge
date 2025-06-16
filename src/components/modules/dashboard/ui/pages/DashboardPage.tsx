"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../hooks/useDashboard.hook";

export function DashboardOverview() {
  const { loading, profile, address, walletName, chatCount } = useDashboard();

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Address:</span>{" "}
            {address || "Not connected"}
          </p>
          {walletName && (
            <p>
              <span className="font-medium">Wallet:</span> {walletName}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {profile ? (
            <>
              <p>
                <span className="font-medium">Name:</span> {profile.firstName}{" "}
                {profile.lastName}
              </p>
              <p>
                <span className="font-medium">Country:</span> {profile.country}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {profile.phoneNumber}
              </p>
            </>
          ) : (
            <p>No profile data available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chats Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <span className="font-medium">Total chats:</span> {chatCount}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
