"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchStats } from "@/lib/blend/helpers";
import { DollarSign, ListChecks, BarChartBig, RefreshCw } from "lucide-react";

interface PlatformStats {
  totalTvl: number;
  activePools: number;
  totalUsers?: number; // Example of an additional stat
  dailyVolume?: number; // Example of an additional stat
}

export default function StatsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
        // Optionally set an error state here
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="flex items-center text-neutral-300">
          <RefreshCw className="h-6 w-6 animate-spin mr-3 text-green-400" />
          <span className="text-lg">Loading Platform Statistics...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <p className="text-neutral-400 text-lg">
          Failed to load platform statistics. Please try again later.
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <BarChartBig className="h-8 w-8 text-green-400" />
          <h1 className="text-3xl font-bold text-neutral-50">
            Platform Statistics
          </h1>
        </div>
        <p className="text-neutral-400 mt-1">
          An overview of key metrics and activity on the Blend protocol.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 shadow-xl rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
            <CardTitle className="text-base font-medium text-neutral-300">
              Total Value Locked (TVL)
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-bold text-green-400">
              {formatCurrency(stats.totalTvl)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              The total amount of assets locked in the protocol.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 shadow-xl rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
            <CardTitle className="text-base font-medium text-neutral-300">
              Active Pools
            </CardTitle>
            <ListChecks className="h-5 w-5 text-sky-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-bold text-sky-400">
              {stats.activePools}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Number of currently active lending pools.
            </p>
          </CardContent>
        </Card>

        {stats.totalUsers !== undefined && (
          <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 shadow-xl rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
              <CardTitle className="text-base font-medium text-neutral-300">
                Total Users
              </CardTitle>
              <ListChecks className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-3xl font-bold text-purple-400">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Total unique users interacting with the protocol.
              </p>
            </CardContent>
          </Card>
        )}

        {stats.dailyVolume !== undefined && (
          <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 shadow-xl rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
              <CardTitle className="text-base font-medium text-neutral-300">
                24h Trading Volume
              </CardTitle>
              <ListChecks className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-3xl font-bold text-amber-400">
                {formatCurrency(stats.dailyVolume)}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Total trading volume in the last 24 hours.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
