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
  Shield,
  Loader2,
  Info,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { useSupplyCollateral } from "../../hooks/useSupplyCollateral.hook";

interface SupplyXLMCollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyXLMCollateralModal({
  isOpen,
  onClose,
  onSuccess,
}: SupplyXLMCollateralModalProps) {
  const {
    collateralAmount,
    loading,
    estimates,
    setCollateralAmount,
    handleSupplyCollateral,
    isHealthy,
    isAtRisk,
    showHealthWarning,
    isSupplyDisabled,
  } = useSupplyCollateral({ isOpen, onClose, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-700 text-neutral-200 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-neutral-100">
                Supply XLM Collateral
              </DialogTitle>
              <DialogDescription className="text-neutral-400 mt-1">
                Deposit XLM to unlock borrowing power
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-5">
          {/* Collateral Amount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="collateral-amount"
                className="text-sm font-medium text-neutral-300"
              >
                Amount to Supply
              </Label>
              <Badge
                variant="outline"
                className="text-xs text-neutral-400 border-neutral-600"
              >
                XLM
              </Badge>
            </div>
            <div className="relative">
              <Input
                id="collateral-amount"
                type="number"
                placeholder="0.00"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="bg-neutral-800 border-neutral-600 text-neutral-200 text-lg h-12 pr-16 font-medium placeholder:text-neutral-500"
                min="0"
                step="0.01"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                XLM
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setCollateralAmount(amount.toString())}
                  disabled={loading}
                  className="flex-1 border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 bg-transparent text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {estimates.borrowingPower > 0 && (
            <div className="space-y-3">
              <Separator className="bg-neutral-700" />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Collateral Overview
                </h3>

                {/* Borrowing Power */}
                <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-400">
                      You will unlock
                    </span>
                    <Badge className="bg-blue-900/30 text-blue-300 border-blue-700 text-xs">
                      75% LTV
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    ${estimates.borrowingPower}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Available borrowing power
                  </p>
                </div>

                {/* Collateral Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        Collateral Value
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-200">
                      ${estimates.collateralValue}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingDown className="h-3 w-3 text-orange-400" />
                      <span className="text-xs text-neutral-400">
                        Liquidation Price
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-orange-400">
                      ${estimates.liquidationPrice}
                    </div>
                  </div>
                </div>

                {/* Health Factor */}
                <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        Health Factor
                      </span>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        isHealthy
                          ? "text-green-400"
                          : isAtRisk
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {estimates.healthFactor}
                    </div>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isHealthy
                          ? "bg-green-400"
                          : isAtRisk
                            ? "bg-yellow-400"
                            : "bg-red-400"
                      }`}
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
            </div>
          )}

          {/* Health Factor Warning */}
          {showHealthWarning && (
            <Alert className="bg-yellow-900/20 border-yellow-700/50">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300 text-sm">
                <strong>Risk Warning:</strong> Your health factor will be at
                risk. Consider supplying more collateral.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-900/20 border-blue-700/50">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300 text-sm">
              <strong>About XLM Collateral:</strong> XLM has a 75% loan-to-value
              ratio. Your health factor must stay above 1.0 to avoid
              liquidation.
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
              onClick={handleSupplyCollateral}
              disabled={isSupplyDisabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Supplying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Supply Collateral
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
