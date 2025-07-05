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
  TrendingUp,
  DollarSign,
  Loader2,
  Info,
  ArrowRight,
  Shield,
  Percent,
} from "lucide-react";
import { useSupply } from "../../hooks/useSupply.hook";

interface SupplyUSDCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyUSDCModal({
  isOpen,
  onClose,
  onSuccess,
}: SupplyUSDCModalProps) {
  const {
    supplyAmount,
    loading,
    estimates,
    setSupplyAmount,
    handleSupplyUSDC,
    isSupplyDisabled,
  } = useSupply({
    isOpen,
    onClose,
    onSuccess,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-700 text-neutral-200 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-neutral-100">
                Supply USDC
              </DialogTitle>
              <DialogDescription className="text-neutral-400 mt-1">
                Earn yield by supplying USDC to the lending pool
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-5">
          {/* Supply Amount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="supply-amount"
                className="text-sm font-medium text-neutral-300"
              >
                Amount to Supply
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
                id="supply-amount"
                type="number"
                placeholder="0.00"
                value={supplyAmount}
                onChange={(e) => setSupplyAmount(e.target.value)}
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
              {[25, 50, 100, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setSupplyAmount(amount.toString())}
                  disabled={loading}
                  className="flex-1 border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 bg-transparent text-xs"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {estimates.expectedBTokens > 0 && (
            <div className="space-y-3">
              <Separator className="bg-neutral-700" />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Transaction Preview
                </h3>

                {/* You Will Receive */}
                <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-400">
                      You will receive
                    </span>
                    <Badge className="bg-green-900/30 text-green-300 border-green-700 text-xs">
                      bUSDC Tokens
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    ~{estimates.expectedBTokens}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Receipt tokens representing your pool share
                  </p>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <Percent className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-neutral-400">
                        Supply APY
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-green-400">
                      {estimates.currentSupplyAPY}%
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-neutral-400">
                        Health Factor
                      </span>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        estimates.newPositionHealth > 50
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {estimates.newPositionHealth}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-900/20 border-blue-700/50">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300 text-sm">
              <strong>About bUSDC:</strong> These tokens automatically earn
              yield and represent your share of the pool. You can redeem them
              anytime for USDC plus accrued interest.
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
              onClick={handleSupplyUSDC}
              disabled={isSupplyDisabled}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Supplying...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Supply USDC
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
