"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchPool, fetchUserInfo } from "@/lib/blend/helpers"; // Mocked helpers
import {
  RefreshCw,
  FlaskConical,
  UserCircle,
  Activity,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { PoolData, UserData } from "@/@types/pool.entity";

export function PoolDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [pool, setPool] = useState<PoolData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  const load = async () => {
    setLoading(true);
    const p = await fetchPool(id);
    const u = await fetchUserInfo(id);
    setPool(p);
    setUser(
      u
        ? {
            ...u,
            bTokens: Number(u.bTokens),
            dTokens: Number(u.dTokens),
            collateral: Number(u.collateral),
            debt: Number(u.debt),
            healthFactor: Number(u.healthFactor),
          }
        : null,
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading || !pool) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-green-400" />
        <p className="ml-3 text-neutral-300 text-lg">Loading pool details...</p>
      </div>
    );
  }

  const tabItems = [
    { value: "general", label: "General", icon: FlaskConical },
    { value: "user", label: "User", icon: UserCircle },
    { value: "health", label: "Health", icon: Activity },
    { value: "backstop", label: "Backstop", icon: ShieldCheck },
    { value: "actions", label: "Actions", icon: Settings },
  ];

  return (
    <div className="space-y-6 text-neutral-100 p-1 max-w-4xl mx-auto">
      <div className="flex justify-between items-center px-2 py-1">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-green-400" />
          <h1 className="text-2xl font-semibold text-neutral-50">
            {pool.name ? `${pool.name} Overview` : `Pool ${id} Overview`}
          </h1>
        </div>
        <Button
          onClick={load}
          size="sm"
          variant="outline"
          className="bg-neutral-700 border-neutral-600 hover:bg-neutral-600 text-neutral-300 hover:text-neutral-50 text-xs"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 bg-neutral-800  rounded-lg mb-6 border border-neutral-700">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-green-500 data-[state=active]:text-neutral-900 data-[state=active]:font-semibold text-neutral-400 hover:bg-neutral-700/70 hover:text-neutral-200 rounded-md  text-xs flex items-center justify-center gap-1.5"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 shadow-lg rounded-lg">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="capitalize text-lg text-neutral-100 flex items-center gap-2">
                  <tab.icon className="h-5 w-5 text-green-400" />
                  {tab.label} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-300 px-5 pb-5">
                {tab.value === "general" && (
                  <>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Assets:
                      </span>{" "}
                      {pool.assets?.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Base Rate:
                      </span>{" "}
                      {pool.interest?.base}%
                    </p>
                    {pool.depositApy !== undefined && (
                      <p>
                        <span className="font-medium text-neutral-200">
                          Deposit APY:
                        </span>{" "}
                        {pool.depositApy}%
                      </p>
                    )}
                    {pool.borrowApy !== undefined && (
                      <p>
                        <span className="font-medium text-neutral-200">
                          Borrow APY:
                        </span>{" "}
                        {pool.borrowApy}%
                      </p>
                    )}
                    {pool.ltv !== undefined && (
                      <p>
                        <span className="font-medium text-neutral-200">
                          LTV:
                        </span>{" "}
                        {pool.ltv}%
                      </p>
                    )}
                    {pool.liquidationThreshold !== undefined && (
                      <p>
                        <span className="font-medium text-neutral-200">
                          Liquidation Threshold:
                        </span>{" "}
                        {pool.liquidationThreshold}%
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-neutral-200">
                        Risk Params:
                      </span>{" "}
                      {JSON.stringify(pool.risk)}
                    </p>
                  </>
                )}
                {tab.value === "user" && user && (
                  <>
                    <p>
                      <span className="font-medium text-neutral-200">
                        bTokens:
                      </span>{" "}
                      {user.bTokens}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        dTokens:
                      </span>{" "}
                      {user.dTokens}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Collateral:
                      </span>{" "}
                      {user.collateral}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Debt:
                      </span>{" "}
                      {user.debt}
                    </p>
                  </>
                )}
                {tab.value === "health" && user && (
                  <p>
                    <span className="font-medium text-neutral-200">
                      Health Factor:
                    </span>{" "}
                    <span className="text-green-400 font-semibold">
                      {user.healthFactor}
                    </span>
                  </p>
                )}
                {tab.value === "backstop" && pool.backstop && (
                  <>
                    <p>
                      <span className="font-medium text-neutral-200">TVL:</span>{" "}
                      {pool.backstop.tvl}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Withdrawal Queue:
                      </span>{" "}
                      {pool.backstop.withdrawalPct}%
                    </p>
                    <p>
                      <span className="font-medium text-neutral-200">
                        Reward Zone:
                      </span>{" "}
                      {pool.backstop.rewardZone ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </p>
                  </>
                )}
                {tab.value === "actions" && (
                  <div className="space-y-3 pt-2">
                    <Button
                      size="sm"
                      className="w-full bg-green-500 hover:bg-green-600 text-neutral-900 font-medium"
                      disabled
                    >
                      Deposit (coming soon)
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-sky-500 hover:bg-sky-600 text-neutral-50 font-medium"
                      disabled
                    >
                      Withdraw (coming soon)
                    </Button>
                  </div>
                )}
                {(tab.value === "user" || tab.value === "health") && !user && (
                  <p className="text-neutral-500">
                    No user data available for this pool.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
