"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  Wallet,
  User,
  ArrowRight,
  FlaskConical,
  CreditCard,
  Shield,
  MapPin,
  Phone,
} from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard.hook";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { fetchPools } from "@/lib/blend/helpers";
import { PoolCard } from "@/components/modules/blend/ui/cards/PoolCard";
import { PoolData } from "@/@types/pool.entity";

export function DashboardOverview() {
  const { loading, profile, address, walletName } = useDashboard();
  const [pools, setPools] = useState<PoolData[]>([]);

  useEffect(() => {
    fetchPools().then(setPools).catch(console.error);
  }, []);

  const formatAddress = (addr: string) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
            {" "}
            {/* Adjusted grid to 2 cols */}
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter className="bg-neutral-700/50 p-4">
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 text-neutral-200">
      {!address && (
        <Alert
          variant="destructive"
          className="bg-amber-900/40 border-amber-700 text-amber-300"
        >
          <AlertCircle className="h-4 w-4 !text-amber-300" />
          <AlertTitle>Please connect your wallet</AlertTitle>
          <AlertDescription>
            The wallet address does not exist on the network. Please fund your
            account!
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-neutral-800 border-neutral-700 shadow-lg">
        <CardHeader className="flex-row items-center justify-between pr-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-7 w-7 text-emerald-400" />
            <CardTitle className="text-lg font-medium text-neutral-100">
              Account Overview
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-700 border border-neutral-700 rounded-lg overflow-hidden">
            <div className="bg-neutral-800 p-4">
              <p className="text-sm text-neutral-400 mb-1">Wallet Status</p>
              <p
                className={`text-xl font-semibold ${address ? "text-emerald-400" : "text-amber-400"}`}
              >
                {address ? "Connected" : "Disconnected"}
              </p>
            </div>
            <div className="bg-neutral-800 p-4">
              <p className="text-sm text-neutral-400 mb-1">Profile Status</p>
              <p
                className={`text-xl font-semibold ${profile ? "text-emerald-400" : "text-amber-400"}`}
              >
                {profile ? "Complete" : "Incomplete"}
              </p>
            </div>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionContent className="pt-6 space-y-6">
                {/* Wallet Details */}
                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <h3 className="font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-400" /> Wallet
                    Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Address
                      </span>
                      <span className="font-mono text-neutral-300">
                        {formatAddress(address || "")}
                      </span>
                    </div>
                    {walletName && (
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Wallet Type
                        </span>
                        <span className="font-medium text-neutral-300">
                          {walletName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Profile Details */}
                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <h3 className="font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-400" /> User Profile
                  </h3>
                  {profile ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Full Name</span>
                        <span className="font-medium text-neutral-300">
                          {profile.firstName} {profile.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Country
                        </span>
                        <span className="font-medium text-neutral-300">
                          {profile.country}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Phone
                        </span>
                        <span className="font-medium text-neutral-300">
                          {profile.phoneNumber}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400 text-center py-4">
                      No profile data available. Please complete your profile.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        <CardFooter className="bg-emerald-900/40 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center">
              <User className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            Dashboard <ArrowRight className="h-4 w-4" />
          </a>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-100">Markets</h2>
        {pools.map((p) => (
          <PoolCard
            key={p.id}
            id={p.id}
            name={p.name}
            state={p.state}
            reserves={p.reserves}
            depositApy={p.depositApy}
            borrowApy={p.borrowApy}
          />
        ))}
      </div>
    </div>
  );
}
