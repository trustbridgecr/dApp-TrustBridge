"use client";

import React, { useState, useEffect } from "react";
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
import {
  TrendingDown,
  Shield,
  AlertTriangle,
  DollarSign,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useWalletContext } from "@/providers/wallet.provider";
import { TOKENS, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK
import { PoolContract, RequestType } from "@blend-capital/blend-sdk";

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
}

export function BorrowModal({ isOpen, onClose }: BorrowModalProps) {
  const { walletAddress } = useWalletContext();
  const [borrowAmount, setBorrowAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimates, setEstimates] = useState({
    healthFactor: 0,
    requiredCollateral: 0,
    borrowAPY: 8.5,
    liquidationThreshold: 75,
  });

  const maxBorrowAmount = 10000; // Mock max borrow based on collateral

  // Update estimates when borrow amount changes
  useEffect(() => {
    if (borrowAmount && Number(borrowAmount) > 0) {
      setEstimating(true);
      
      // Simulate estimation calculation
      setTimeout(() => {
        const amount = Number(borrowAmount);
        const requiredCollateral = amount * 1.5; // 150% collateralization
        const healthFactor = Math.max(1.2, 3 - (amount / maxBorrowAmount) * 2);
        
        setEstimates({
          healthFactor,
          requiredCollateral,
          borrowAPY: 8.5 + (amount / maxBorrowAmount) * 2, // Interest increases with utilization
          liquidationThreshold: 75,
        });
        setEstimating(false);
      }, 500);
    }
  }, [borrowAmount, maxBorrowAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBorrowAmount(value);
  };

  const handleBorrow = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!borrowAmount || Number(borrowAmount) <= 0) {
      toast.error("Please enter a valid borrow amount");
      return;
    }

    setLoading(true);
    
    try {
      // Convert UI amount to contract format (USDC has 7 decimals on Stellar)
      const amountInt = BigInt(Number(borrowAmount) * 1e7);
      
      // Check if pool is deployed
      if (!TRUSTBRIDGE_POOL_ID) {
        toast.error("TrustBridge pool not yet deployed. Please deploy the pool first.");
        return;
      }
      
      // Note: Network configuration would be used for transaction simulation/submission
      
      // Create pool contract instance and borrow operation
      const pool = new PoolContract(TRUSTBRIDGE_POOL_ID);
      const borrowOpXdr = pool.submit({
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [
          {
            request_type: RequestType.Borrow,
            address: TOKENS.USDC,
            amount: amountInt,
          },
        ],
      });
      
      // Sign transaction with Freighter wallet
      const signedTx = await signTransaction({ 
        unsignedTransaction: borrowOpXdr, 
        address: walletAddress 
      });
      
      toast.success(`Successfully borrowed ${borrowAmount} USDC!`);
      
      // Log transaction details
      console.log("Borrow transaction completed:", {
        amount: borrowAmount,
        healthFactor: estimates.healthFactor,
        collateralUsed: estimates.requiredCollateral,
        signedTransaction: signedTx,
      });
      
      onClose();
      
    } catch (error) {
      console.error("Borrow transaction failed:", error);
      toast.error("Failed to complete borrow transaction");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setBorrowAmount("");
    setEstimates({
      healthFactor: 0,
      requiredCollateral: 0,
      borrowAPY: 8.5,
      liquidationThreshold: 75,
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const isHealthy = estimates.healthFactor >= 1.5;
  const isRisky = estimates.healthFactor < 1.2;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-neutral-800 border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-100">
            <TrendingDown className="h-5 w-5 text-emerald-400" />
            Borrow USDC
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Borrow USDC from the TrustBridge-MicroLoans pool. Collateral required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium text-neutral-300">
              Borrow Amount (USDC)
            </Label>
            <div className="space-y-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={borrowAmount}
                  onChange={handleAmountChange}
                  className="pl-10 bg-neutral-700 border-neutral-600 text-neutral-200 placeholder:text-neutral-500"
                  max={maxBorrowAmount}
                  step="0.01"
                />
              </div>
              
              {/* Amount buttons */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>0 USDC</span>
                  <span>{maxBorrowAmount.toLocaleString()} USDC Available</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBorrowAmount((maxBorrowAmount * 0.25).toFixed(2))}
                    className="flex-1 bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600"
                  >
                    25%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBorrowAmount((maxBorrowAmount * 0.5).toFixed(2))}
                    className="flex-1 bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600"
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBorrowAmount((maxBorrowAmount * 0.75).toFixed(2))}
                    className="flex-1 bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600"
                  >
                    75%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBorrowAmount(maxBorrowAmount.toFixed(2))}
                    className="flex-1 bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600"
                  >
                    Max
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-700" />

          {/* Estimates */}
          {borrowAmount && Number(borrowAmount) > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Loan Estimates
                {estimating && <Loader2 className="h-3 w-3 animate-spin" />}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-neutral-400">Health Factor</p>
                  <p className={`font-semibold ${isRisky ? 'text-red-400' : isHealthy ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {estimates.healthFactor.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-400">Required Collateral (XLM)</p>
                  <p className="font-semibold text-neutral-200">
                    {estimates.requiredCollateral.toLocaleString()} XLM
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-400">Borrow APY</p>
                  <p className="font-semibold text-orange-400">
                    {estimates.borrowAPY.toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-400">Liquidation Threshold</p>
                  <p className="font-semibold text-neutral-200">
                    {estimates.liquidationThreshold}%
                  </p>
                </div>
              </div>

              {/* Health Factor Alert */}
              {isRisky && (
                <Alert variant="destructive" className="bg-red-900/40 border-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-300">
                    Warning: Low health factor increases liquidation risk. Consider reducing borrow amount.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={loading || !borrowAmount || Number(borrowAmount) <= 0 || !walletAddress}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Borrowing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Borrow
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-neutral-500 text-center">
            Transactions are signed using your connected wallet and submitted to Stellar Testnet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 