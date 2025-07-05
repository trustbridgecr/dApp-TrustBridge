"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  Shield,
  AlertTriangle,
  DollarSign,
  Loader2,
  CheckCircle,
  ArrowRight,
  Info,
  Percent,
} from "lucide-react";
import { useBorrow } from "../../hooks/useBorrow.hook";

interface PoolReserve {
  symbol: string;
  supplied: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
}

interface PoolData {
  name: string;
  totalSupplied: string;
  totalBorrowed: string;
  utilizationRate: string;
  reserves: PoolReserve[];
}

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolData: PoolData | null;
  poolId?: string;
}

export function BorrowModal({ isOpen, onClose, poolId }: BorrowModalProps) {
  const {
    borrowAmount,
    loading,
    estimates,
    setBorrowAmount,
    handleBorrow,
    isHealthy,
    isAtRisk,
    isDangerous,
    isBorrowDisabled,
  } = useBorrow({ isOpen, onClose, poolId });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-700 text-neutral-200 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-900/30 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-neutral-100">
                Borrow USDC
              </DialogTitle>
              <DialogDescription className="text-neutral-400 mt-1">
                Borrow USDC against your collateral
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-5">
          {/* Borrow Amount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="borrowAmount"
                className="text-sm font-medium text-neutral-300"
              >
                Amount to Borrow
              </Label>
              <Badge
                variant="outline"
                className="text-xs text-neutral-400 border-neutral-600"
              >
                USDC
              </Badge>
            </div>
            <div className="relative">
              <Input
                id="borrowAmount"
                type="number"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="bg-neutral-800 border-neutral-600 text-neutral-200 text-lg h-12 pr-16 font-medium placeholder:text-neutral-500"
                min="0"
                step="0.01"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                USDC
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 500, 1000, 2500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBorrowAmount(amount.toString())}
                  disabled={loading}
                  className="flex-1 border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 bg-transparent text-xs"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {borrowAmount && Number(borrowAmount) > 0 && (
            <div className="space-y-3">
              <Separator className="bg-neutral-700" />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Borrow Overview
                </h3>

                {/* Health Factor Card */}
                <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">
                      Health Factor
                    </span>
                    <div className="flex items-center gap-1">
                      {isHealthy ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle
                          className={`h-4 w-4 ${isAtRisk ? "text-yellow-400" : "text-red-400"}`}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      isHealthy
                        ? "text-green-400"
                        : isAtRisk
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {estimates.healthFactor > 0
                      ? estimates.healthFactor.toFixed(2)
                      : "--"}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isHealthy
                            ? "bg-green-400"
                            : isAtRisk
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(0, (estimates.healthFactor / 3) * 100))}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {isHealthy
                        ? "Healthy position"
                        : isAtRisk
                          ? "At risk"
                          : "Liquidation risk"}
                    </p>
                  </div>
                </div>

                {/* Borrow Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <Percent className="h-3 w-3 text-orange-400" />
                      <span className="text-xs text-neutral-400">
                        Borrow APY
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-orange-400">
                      {estimates.borrowAPY}%
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        Liquidation Threshold
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-200">
                      {estimates.liquidationThreshold}%
                    </div>
                  </div>
                </div>

                {/* Required Collateral */}
                <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        Required Collateral
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-200">
                      $
                      {estimates.requiredCollateral > 0
                        ? estimates.requiredCollateral.toLocaleString()
                        : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Factor Warning */}
          {estimates.healthFactor > 0 && (
            <Alert
              className={`${
                isHealthy
                  ? "bg-green-900/20 border-green-700/50"
                  : isAtRisk
                    ? "bg-yellow-900/20 border-yellow-700/50"
                    : "bg-red-900/20 border-red-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle
                    className={`h-4 w-4 ${isAtRisk ? "text-yellow-400" : "text-red-400"}`}
                  />
                )}
                <AlertDescription
                  className={`text-sm ${isHealthy ? "text-green-300" : isAtRisk ? "text-yellow-300" : "text-red-300"}`}
                >
                  {isHealthy && (
                    <>
                      <strong>Healthy Position:</strong> You have sufficient
                      collateral buffer for this borrow amount.
                    </>
                  )}
                  {isAtRisk && (
                    <>
                      <strong>Position At Risk:</strong> Consider reducing
                      borrow amount or adding more collateral.
                    </>
                  )}
                  {isDangerous && (
                    <>
                      <strong>Dangerous Position:</strong> This could lead to
                      immediate liquidation!
                    </>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Risk Disclaimer */}
          <Alert className="bg-blue-900/20 border-blue-700/50">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300 text-sm">
              <strong>Risk Disclaimer:</strong> Borrowing involves liquidation
              risk. Monitor your health factor regularly and maintain adequate
              collateral ratios to avoid liquidation.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={isBorrowDisabled}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Borrow USDC
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
