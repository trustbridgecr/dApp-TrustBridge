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
  Shield,
  TrendingUp,
  Loader2,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useWalletContext } from "@/providers/wallet.provider";
import { TOKENS, NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK and Stellar SDK
import { PoolContract, RequestType } from "@blend-capital/blend-sdk";
import { 
  TransactionBuilder, 
  xdr, 
  rpc,
  Operation,
  Account
} from "@stellar/stellar-sdk";

interface SupplyXLMCollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyXLMCollateralModal({ isOpen, onClose, onSuccess }: SupplyXLMCollateralModalProps) {
  const { walletAddress } = useWalletContext();
  const [collateralAmount, setCollateralAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [estimates, setEstimates] = useState({
    borrowingPower: 0,
    collateralValue: 0,
    healthFactor: 0,
    liquidationPrice: 0,
  });

  // Real-time calculations as user types
  useEffect(() => {
    if (collateralAmount && Number(collateralAmount) > 0) {
      const amount = Number(collateralAmount);
      const xlmPrice = 0.12; // Mock XLM price in USD
      const collateralFactor = 0.75; // 75% collateral factor for XLM
      
      // Calculate estimates
      const collateralValue = amount * xlmPrice;
      const borrowingPower = collateralValue * collateralFactor;
      const healthFactor = 2.5; // Healthy when no borrows exist
      const liquidationPrice = xlmPrice * 0.6; // 40% buffer
      
      setEstimates({
        borrowingPower: Math.round(borrowingPower * 100) / 100,
        collateralValue: Math.round(collateralValue * 100) / 100,
        healthFactor: Math.round(healthFactor * 100) / 100,
        liquidationPrice: Math.round(liquidationPrice * 1000) / 1000,
      });
    } else {
      setEstimates({
        borrowingPower: 0,
        collateralValue: 0,
        healthFactor: 0,
        liquidationPrice: 0,
      });
    }
  }, [collateralAmount]);

  const handleSupplyCollateral = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!collateralAmount || Number(collateralAmount) <= 0) {
      toast.error("Please enter a valid collateral amount");
      return;
    }

    if (!TRUSTBRIDGE_POOL_ID) {
      toast.error("Pool not deployed yet. Please deploy the pool first.");
      return;
    }

    setLoading(true);
    
    try {
      // Convert UI amount to contract format (XLM has 7 decimals on Stellar)
      const amountInt = BigInt(Number(collateralAmount) * 1e7);
      
      toast.info("Creating collateral transaction...");
      
      // Create RPC client
      const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
      
      // Get account information
      const account = await server.getAccount(walletAddress);
      
      // Create pool contract instance and supply collateral operation
      const pool = new PoolContract(TRUSTBRIDGE_POOL_ID);
      const collateralOpXdr = pool.submit({
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [
          {
            request_type: RequestType.SupplyCollateral,
            address: TOKENS.XLM,
            amount: amountInt,
          },
        ],
      });
      
      // Convert XDR to operation
      const operation = xdr.Operation.fromXDR(collateralOpXdr, 'base64');
      
      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: '1000000', // Higher fee for Soroban operations
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();
      
      // Simulate transaction to get SorobanData
      toast.info("Simulating transaction...");
      const simulationResult = await server.simulateTransaction(transaction);
      
      if (rpc.Api.isSimulationError(simulationResult)) {
        throw new Error(`Simulation failed: ${simulationResult.error}`);
      }

      // Use assembleTransaction helper from rpc
      const assembledTx = rpc.assembleTransaction(transaction, simulationResult).build();
      
      // Sign and submit transaction
      toast.info("Please approve the transaction in your wallet...");
      const signedTransaction = await signTransaction(assembledTx.toXDR());
      
      toast.info("Submitting transaction...");
      const result = await server.sendTransaction(signedTransaction);
      
      // Transaction submitted, wait for confirmation
      toast.info("Transaction submitted, waiting for confirmation...");
      
      // Poll for transaction status
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        try {
          const txResult = await server.getTransaction(result.hash);
          if (txResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
            clearInterval(pollInterval);
            toast.success(
              `Successfully supplied ${collateralAmount} XLM as collateral! Borrowing power: $${estimates.borrowingPower}`
            );
            setCollateralAmount("");
            onSuccess?.();
            onClose();
          } else if (txResult.status === rpc.Api.GetTransactionStatus.FAILED) {
            clearInterval(pollInterval);
            throw new Error(`Transaction failed: ${txResult.resultMetaXdr}`);
          }
        } catch (pollError) {
          console.error("Polling error:", pollError);
        }
        
        attempts++;
        if (attempts > 30) { // 30 attempts = 1 minute
          clearInterval(pollInterval);
          throw new Error("Transaction confirmation timeout");
        }
      }, 2000);
      
    } catch (error: unknown) {
      console.error("Collateral transaction failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Handle specific Blend protocol errors
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes("Error(Contract, #1206)")) {
        userFriendlyMessage = "Pool is not currently active. The TrustBridge pool may need to be activated by the admin or require additional backstop funding. Please check back later or contact support.";
      } else if (errorMessage.includes("Error(Contract, #1202)")) {
        userFriendlyMessage = "Pool is not active yet. Please wait for pool activation.";
      } else if (errorMessage.includes("Error(Contract, #1203)")) {
        userFriendlyMessage = "XLM reserve is not enabled. Please contact support.";
      } else if (errorMessage.includes("Error(Contract, #1205)")) {
        userFriendlyMessage = "Insufficient pool liquidity. Please try a smaller amount or wait for more liquidity.";
      } else if (errorMessage.includes("Simulation failed")) {
        userFriendlyMessage = "Transaction simulation failed. Please ensure you have sufficient XLM balance and the pool is active.";
      }
      
      toast.error(`Collateral supply failed: ${userFriendlyMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setCollateralAmount("");
    setEstimates({
      borrowingPower: 0,
      collateralValue: 0,
      healthFactor: 0,
      liquidationPrice: 0,
    });
  };

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const isHealthy = estimates.healthFactor >= 1.5;
  const isAtRisk = estimates.healthFactor < 1.5 && estimates.healthFactor >= 1.2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Supply XLM as Collateral
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Deposit XLM to use as collateral for borrowing other assets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Collateral Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="collateral-amount" className="text-sm font-medium text-neutral-300">
              Collateral Amount (XLM)
            </Label>
            <Input
              id="collateral-amount"
              type="number"
              placeholder="1000.00"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="bg-neutral-800 border-neutral-600 text-neutral-200 text-lg h-12"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          {/* Collateral Details */}
          {estimates.borrowingPower > 0 && (
            <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
              <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Collateral Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Collateral Value:</span>
                  <span className="text-neutral-200 font-medium">${estimates.collateralValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Borrowing Power (75%):</span>
                  <span className="text-blue-400 font-medium">${estimates.borrowingPower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Health Factor:</span>
                  <span className={isHealthy ? "text-green-400" : isAtRisk ? "text-yellow-400" : "text-red-400"}>
                    {estimates.healthFactor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Liquidation Price:</span>
                  <span className="text-orange-400">${estimates.liquidationPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Health Factor Warning */}
          {estimates.healthFactor > 0 && estimates.healthFactor < 1.5 && (
            <Alert className="bg-yellow-900/20 border-yellow-700">
              <AlertTriangle className="h-4 w-4 !text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                Your health factor will be at risk. Consider supplying more collateral or borrowing less.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-900/20 border-blue-700">
            <Info className="h-4 w-4 !text-blue-400" />
            <AlertDescription className="text-blue-300">
              XLM collateral has a 75% collateral factor. Your health factor must stay above 1.0 to avoid liquidation.
            </AlertDescription>
          </Alert>

          <Separator className="bg-neutral-700" />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSupplyCollateral}
              disabled={!walletAddress || !collateralAmount || Number(collateralAmount) <= 0 || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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