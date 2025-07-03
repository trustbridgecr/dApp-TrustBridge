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
import { TOKENS, NETWORK_CONFIG } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK and Stellar SDK
import { PoolContract, RequestType } from "@blend-capital/blend-sdk";
import { 
  TransactionBuilder, 
  xdr, 
  Networks, 
  rpc,
  Operation,
  Account
} from "@stellar/stellar-sdk";

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
  const { walletAddress } = useWalletContext();
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [estimates, setEstimates] = useState({
    healthFactor: 0,
    requiredCollateral: 0,
    borrowAPY: 8.5,
    liquidationThreshold: 75,
  });

  // Real-time calculations as user types
  useEffect(() => {
    if (borrowAmount && Number(borrowAmount) > 0) {
      const amount = Number(borrowAmount);
      
      // Calculate real-time estimates
      const healthFactor = Math.max(0.1, 1.5 - (amount / 10000)); // Simplified calculation
      const requiredCollateral = amount * 1.2; // 120% collateralization
      
      setEstimates(prev => ({
        ...prev,
        healthFactor: Math.round(healthFactor * 100) / 100,
        requiredCollateral: Math.round(requiredCollateral * 100) / 100,
      }));
    } else {
      setEstimates(prev => ({
        ...prev,
        healthFactor: 0,
        requiredCollateral: 0,
      }));
    }
  }, [borrowAmount]);

  const handleBorrow = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!borrowAmount || Number(borrowAmount) <= 0) {
      toast.error("Please enter a valid borrow amount");
      return;
    }

    if (!poolId) {
      toast.error("TrustBridge pool not yet deployed. Please deploy the pool first.");
      return;
    }

    setLoading(true);
    
    try {
      // Convert UI amount to contract format (USDC has 7 decimals on Stellar)
      const amountInt = BigInt(Number(borrowAmount) * 1e7);
      
      toast.info("Creating borrow transaction...");
      
      // Create RPC client
      const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
      
      // Get account information
      const account = await server.getAccount(walletAddress);
      
      // Create pool contract instance and borrow operation
      const pool = new PoolContract(poolId);
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
      
      // Convert XDR to operation
      const operation = xdr.Operation.fromXDR(borrowOpXdr, 'base64');
      
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
      
      // Update transaction with simulated data
      const assembledTx = rpc.assembleTransaction(transaction, simulationResult).build();
      
      // Sign transaction with wallet
      toast.info("Please sign the transaction in your wallet...");
      const signedTx = await signTransaction(assembledTx.toXDR());
      
      if (!signedTx) {
        throw new Error("Transaction signing was cancelled or failed");
      }
      
      // Submit transaction to network
      toast.info("Submitting transaction to Stellar network...");
      const result = await server.sendTransaction(signedTx);
      
      // Wait for transaction confirmation
      toast.info("Transaction submitted! Waiting for confirmation...");
        
        // Wait for transaction confirmation
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            const txResult = await server.getTransaction(result.hash);
            
            if (txResult.status === "SUCCESS") {
              toast.success(`Successfully borrowed ${borrowAmount} USDC!`);
              
              // Log transaction details
              console.log("Borrow transaction completed:", {
                amount: borrowAmount,
                asset: "USDC",
                poolId: poolId,
                healthFactor: estimates.healthFactor,
                collateralRequired: estimates.requiredCollateral,
                transactionHash: result.hash,
              });
              
              onClose();
              return;
            } else if (txResult.status === "FAILED") {
              throw new Error(`Transaction failed: ${txResult.resultXdr || 'Unknown error'}`);
            }
          } catch (pollError) {
            console.warn("Error polling transaction status:", pollError);
          }
          
          attempts++;
        }
        
        throw new Error("Transaction confirmation timeout. Please check transaction status manually.");
      
    } catch (error: unknown) {
      console.error("Borrow transaction failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Handle specific Blend protocol errors
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes("Error(Contract, #1206)")) {
        userFriendlyMessage = "Insufficient reserves in the pool. Please wait for someone to supply USDC to the pool first, or supply USDC yourself before borrowing.";
      } else if (errorMessage.includes("Error(Contract, #1205)")) {
        userFriendlyMessage = "Insufficient collateral. Please deposit more collateral or reduce your borrow amount.";
      } else if (errorMessage.includes("Error(Contract, #1207)")) {
        userFriendlyMessage = "Maximum borrowing capacity reached. Please try a smaller amount.";
      } else if (errorMessage.includes("Simulation failed")) {
        userFriendlyMessage = "Transaction simulation failed. This might be due to insufficient reserves or collateral issues.";
      }
      
      toast.error(`Borrow failed: ${userFriendlyMessage}`);
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

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const isHealthy = estimates.healthFactor >= 1.2;
  const isAtRisk = estimates.healthFactor < 1.2 && estimates.healthFactor >= 1.0;
  const isDangerous = estimates.healthFactor < 1.0 && estimates.healthFactor > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            Borrow USDC
          </DialogTitle>
          <DialogDescription>
            Borrow USDC from the TrustBridge lending pool. Make sure you have sufficient collateral.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Borrow Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="borrowAmount">Borrow Amount (USDC)</Label>
            <div className="relative">
              <Input
                id="borrowAmount"
                type="number"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="text-right pr-12"
                min="0"
                step="0.01"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                USDC
              </div>
            </div>
          </div>

          {/* Real-time Estimates */}
          {borrowAmount && Number(borrowAmount) > 0 && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Transaction Estimates</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Health Factor</div>
                  <div className={`font-medium ${
                    isHealthy ? 'text-green-600' : 
                    isAtRisk ? 'text-yellow-600' : 
                    isDangerous ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {estimates.healthFactor > 0 ? estimates.healthFactor.toFixed(2) : '--'}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">Required Collateral</div>
                  <div className="font-medium">
                    ${estimates.requiredCollateral > 0 ? estimates.requiredCollateral.toLocaleString() : '--'}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">Borrow APY</div>
                  <div className="font-medium text-orange-600">
                    {estimates.borrowAPY}%
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">Liquidation Threshold</div>
                  <div className="font-medium">
                    {estimates.liquidationThreshold}%
                  </div>
                </div>
              </div>

              {/* Health Factor Warning */}
              {estimates.healthFactor > 0 && (
                <Alert className={`${
                  isHealthy ? 'border-green-200 bg-green-50' :
                  isAtRisk ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {isHealthy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 ${isAtRisk ? 'text-yellow-600' : 'text-red-600'}`} />
                    )}
                    <AlertDescription className={`${
                      isHealthy ? 'text-green-700' :
                      isAtRisk ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {isHealthy && "Your position looks healthy. You have sufficient collateral buffer."}
                      {isAtRisk && "Your position is at risk. Consider reducing borrow amount or adding more collateral."}
                      {isDangerous && "Dangerous position! This could lead to immediate liquidation."}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={
                loading || 
                !borrowAmount || 
                Number(borrowAmount) <= 0 || 
                !walletAddress ||
                !poolId ||
                (estimates.healthFactor > 0 && estimates.healthFactor < 1.0)
              }
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Borrow USDC
                </>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Risk Disclaimer:</strong> Borrowing assets involves liquidation risk. 
              Ensure you understand the risks and maintain adequate collateral ratios. 
              Monitor your health factor regularly to avoid liquidation.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
} 