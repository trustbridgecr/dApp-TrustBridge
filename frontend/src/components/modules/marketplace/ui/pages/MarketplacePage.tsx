"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Percent,
  Shield,
  Loader2,
  Wallet,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { BorrowModal } from "../components/BorrowModal";
import { SupplyUSDCModal } from "../components/SupplyUSDCModal";
import { SupplyXLMCollateralModal } from "../components/SupplyXLMCollateralModal";
import { ProvideLiquidityModal } from "../components/ProvideLiquidityModal";
import { useMarketplace } from "@/hooks/use-marketplace";

// Pool Data Interface
interface PoolReserve {
  symbol: string;
  supplied: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
}

export function MarketplacePage() {
  const {
    loading,
    deploying,
    supplying,
    deployedPoolId,
    supplyAmount,
    showBorrowModal,
    showSupplyUSDCModal,
    showSupplyXLMModal,
    showProvideLiquidityModal,
    mockPoolData,
    POOL_CONFIG,
    ORACLE_ID,
    setSupplyAmount,
    handleDeployPool,
    handleSupplyToPool,
    openBorrowModal,
    closeBorrowModal,
    openSupplyUSDCModal,
    closeSupplyUSDCModal,
    openSupplyXLMModal,
    closeSupplyXLMModal,
    openProvideLiquidityModal,
    closeProvideLiquidityModal,
    handleSupplySuccess,
    isWalletConnected,
    isPoolDeployed,
    canSupplyToPool,
    canDeployPool,
    canInteractWithPool,
  } = useMarketplace();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <Skeleton className="h-12 w-80 bg-neutral-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-neutral-800" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-neutral-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Marketplace</h1>
            <p className="text-neutral-400 mt-1">
              Decentralized lending pools powered by Blend Protocol
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60">
              Stellar Testnet
            </Badge>
            {isWalletConnected && (
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Connection Alert */}
        {!isWalletConnected && (
          <Alert className="bg-amber-900/40 border-amber-700">
            <AlertCircle className="h-4 w-4 text-amber-300" />
            <AlertTitle className="text-amber-200">
              Connect Your Wallet
            </AlertTitle>
            <AlertDescription className="text-amber-300">
              Please connect your Stellar wallet to interact with the lending
              pools.
            </AlertDescription>
          </Alert>
        )}

        {/* Pool Status Alert */}
        {isWalletConnected && isPoolDeployed && (
          <Alert className="bg-green-900/40 border-green-700">
            <Shield className="h-4 w-4 text-green-300" />
            <AlertTitle className="text-green-200">
              Pool Ready for Lending
            </AlertTitle>
            <AlertDescription className="text-green-300">
              Pool deployed successfully! You can now supply USDC to provide
              liquidity and users can borrow from the pool. The pool is
              configured with USDC reserves and ready for operation.
            </AlertDescription>
          </Alert>
        )}

        {/* Pool Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-400">
                  Total Supplied
                </CardTitle>
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">
                ${mockPoolData?.totalSupplied}
              </div>
              <p className="text-sm text-emerald-400 mt-1">
                +2.1% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-400">
                  Total Borrowed
                </CardTitle>
                <div className="p-2 bg-orange-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">
                ${mockPoolData?.totalBorrowed}
              </div>
              <p className="text-sm text-orange-400 mt-1">
                +5.3% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-400">
                  Utilization Rate
                </CardTitle>
                <div className="p-2 bg-blue-900/30 rounded-lg">
                  <Percent className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">
                {mockPoolData?.utilizationRate}%
              </div>
              <p className="text-sm text-blue-400 mt-1">Optimal: 50-80%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Pool Card */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {POOL_CONFIG.name} Pool
                  </CardTitle>
                  <p className="text-sm text-neutral-400 mt-1">
                    Oracle: {ORACLE_ID.substring(0, 8)}...
                    {ORACLE_ID.substring(-4)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="text-neutral-300 border-neutral-600 bg-neutral-800/50"
                >
                  {POOL_CONFIG.maxPositions} Max Positions
                </Badge>
                <Badge
                  variant="outline"
                  className="text-neutral-300 border-neutral-600 bg-neutral-800/50"
                >
                  {POOL_CONFIG.backstopRate}% Backstop Rate
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockPoolData?.reserves.map(
                (reserve: PoolReserve, index: number) => (
                  <div
                    key={reserve.symbol}
                    className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white text-lg">
                        {reserve.symbol}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-neutral-700 text-neutral-300 border-neutral-600"
                      >
                        Reserve {index + 1}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          Supplied
                        </span>
                        <span className="font-medium text-neutral-200">
                          ${reserve.supplied}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          Borrowed
                        </span>
                        <span className="font-medium text-neutral-200">
                          ${reserve.borrowed}
                        </span>
                      </div>
                      <Separator className="bg-neutral-700" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          Supply APY
                        </span>
                        <span className="font-semibold text-emerald-400">
                          {reserve.supplyAPY}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">
                          Borrow APY
                        </span>
                        <span className="font-semibold text-orange-400">
                          {reserve.borrowAPY}%
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>

          <CardFooter className="bg-neutral-900/30 border-t border-neutral-700 rounded-b-lg">
            <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Quick Supply Section */}
              {isPoolDeployed && (
                <div className="pb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={supplyAmount}
                      onChange={(e) => setSupplyAmount(e.target.value)}
                      className="w-32 bg-neutral-800 border-neutral-600 text-neutral-200 placeholder:text-neutral-500"
                      min="0"
                      step="1"
                      disabled={supplying}
                    />
                    <Button
                      onClick={handleSupplyToPool}
                      disabled={!canSupplyToPool}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {supplying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Supplying...
                        </>
                      ) : (
                        "Quick Supply"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className=" pb-4 flex flex-wrap gap-3">
                {!isPoolDeployed && (
                  <Button
                    onClick={handleDeployPool}
                    disabled={!canDeployPool}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {deploying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      "Deploy Pool"
                    )}
                  </Button>
                )}

                {isPoolDeployed && (
                  <>
                    <Button
                      onClick={openSupplyUSDCModal}
                      disabled={!isWalletConnected}
                      variant="outline"
                      className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20 bg-transparent"
                    >
                      Supply USDC
                    </Button>
                    <Button
                      onClick={openSupplyXLMModal}
                      disabled={!isWalletConnected}
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-900/20 bg-transparent"
                    >
                      Supply XLM
                    </Button>
                  </>
                )}

                <Button
                  onClick={openProvideLiquidityModal}
                  disabled={!canInteractWithPool}
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                >
                  Provide Liquidity
                </Button>

                <Button
                  onClick={openBorrowModal}
                  disabled={!canInteractWithPool}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  Borrow USDC
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Modals */}
        <BorrowModal
          isOpen={showBorrowModal}
          onClose={closeBorrowModal}
          poolData={mockPoolData}
          poolId={deployedPoolId || ""}
        />
        <SupplyUSDCModal
          isOpen={showSupplyUSDCModal}
          onClose={closeSupplyUSDCModal}
          onSuccess={handleSupplySuccess}
        />
        <SupplyXLMCollateralModal
          isOpen={showSupplyXLMModal}
          onClose={closeSupplyXLMModal}
          onSuccess={handleSupplySuccess}
        />
        <ProvideLiquidityModal
          isOpen={showProvideLiquidityModal}
          onClose={closeProvideLiquidityModal}
          poolData={mockPoolData}
        />
      </div>
    </div>
  );
}