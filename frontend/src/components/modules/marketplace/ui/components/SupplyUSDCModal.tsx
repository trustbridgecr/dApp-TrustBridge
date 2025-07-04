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
  TrendingUp,
  DollarSign,
  Loader2,
  Info,
} from "lucide-react";
import { useWalletContext } from "@/providers/wallet.provider";
import { TOKENS, NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK and Stellar SDK
import { PoolContractV2, RequestType } from "@blend-capital/blend-sdk";
import { 
  TransactionBuilder, 
  xdr, 
  rpc
} from "@stellar/stellar-sdk";

interface SupplyUSDCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyUSDCModal({ isOpen, onClose, onSuccess }: SupplyUSDCModalProps) {
  const { walletAddress } = useWalletContext();
  const [supplyAmount, setSupplyAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [estimates, setEstimates] = useState({
    expectedBTokens: 0,
    currentSupplyAPY: 4.2,
    newPositionHealth: 0,
  });

  // Real-time calculations as user types
  useEffect(() => {
    if (supplyAmount && Number(supplyAmount) > 0) {
      const amount = Number(supplyAmount);
      
      // Calculate estimated bTokens (1:1 ratio for simplicity, in reality depends on exchange rate)
      const expectedBTokens = amount * 0.98; // Small fee consideration
      const newPositionHealth = Math.min(100, 85 + (amount / 1000)); // Health improves with supply
      
      setEstimates(prev => ({
        ...prev,
        expectedBTokens: Math.round(expectedBTokens * 100) / 100,
        newPositionHealth: Math.round(newPositionHealth * 100) / 100,
      }));
    } else {
      setEstimates(prev => ({
        ...prev,
        expectedBTokens: 0,
        newPositionHealth: 0,
      }));
    }
  }, [supplyAmount]);

  const handleSupplyUSDC = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!supplyAmount || Number(supplyAmount) <= 0) {
      toast.error("Please enter a valid supply amount");
      return;
    }

    if (!TRUSTBRIDGE_POOL_ID) {
      toast.error("Pool not deployed yet. Please deploy the pool first.");
      return;
    }

    setLoading(true);
    
    try {
      // Convert UI amount to contract format (USDC has 7 decimals on Stellar)
      const amountInt = BigInt(Number(supplyAmount) * 1e7);
      
      toast.info("Creating supply transaction...");
      
      // Create RPC client
      const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
      
      // Get account information
      const account = await server.getAccount(walletAddress);
      
      // Create pool contract instance and supply operation
      const pool = new PoolContractV2(TRUSTBRIDGE_POOL_ID);
      const supplyOpXdr = pool.submit({
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [
          {
            request_type: RequestType.Supply, // Use Supply for lending to earn yield
            address: TOKENS.USDC,
            amount: amountInt,
          },
        ],
      });
      
      // Convert XDR to operation
      const operation = xdr.Operation.fromXDR(supplyOpXdr, 'base64');
      
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
      
      if (result.status === "PENDING") {
        toast.info("Transaction submitted, waiting for confirmation...");
        
        // Poll for transaction status
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          try {
            const txResult = await server.getTransaction(result.hash);
            if (txResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
              clearInterval(pollInterval);
              toast.success(
                `Successfully supplied ${supplyAmount} USDC! You received ~${estimates.expectedBTokens} bUSDC tokens.`
              );
              setSupplyAmount("");
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
        
      } else {
        throw new Error(`Transaction failed: ${result.errorResult || 'Unknown error'}`);
      }
      
    } catch (error: unknown) {
      console.error("Supply transaction failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Handle specific Blend protocol errors
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes("Error(Contract, #1206)")) {
        userFriendlyMessage = "Pool is not currently active. The TrustBridge pool may need to be activated by the admin or require additional backstop funding. Please check back later or contact support.";
      } else if (errorMessage.includes("Error(Contract, #1202)")) {
        userFriendlyMessage = "Pool is not active yet. Please wait for pool activation.";
      } else if (errorMessage.includes("Error(Contract, #1203)")) {
        userFriendlyMessage = "USDC reserve is not enabled. Please contact support.";
      } else if (errorMessage.includes("Error(Contract, #1205)")) {
        userFriendlyMessage = "Pool supply cap reached. Please try a smaller amount.";
      } else if (errorMessage.includes("Simulation failed")) {
        userFriendlyMessage = "Transaction simulation failed. Please ensure you have sufficient USDC balance and the pool is active.";
      }
      
      toast.error(`Supply failed: ${userFriendlyMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSupplyAmount("");
    setEstimates({
      expectedBTokens: 0,
      currentSupplyAPY: 4.2,
      newPositionHealth: 0,
    });
  };

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Supply USDC
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Supply USDC to earn yield and receive bUSDC tokens as receipt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supply Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="supply-amount" className="text-sm font-medium text-neutral-300">
              Supply Amount (USDC)
            </Label>
            <Input
              id="supply-amount"
              type="number"
              placeholder="100.00"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              className="bg-neutral-800 border-neutral-600 text-neutral-200 text-lg h-12"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          {/* Supply Details */}
          {estimates.expectedBTokens > 0 && (
            <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
              <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Supply Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Expected bUSDC Tokens:</span>
                  <span className="text-green-400 font-medium">~{estimates.expectedBTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Current Supply APY:</span>
                  <span className="text-green-400">{estimates.currentSupplyAPY}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Position Health:</span>
                  <span className={estimates.newPositionHealth > 50 ? "text-green-400" : "text-yellow-400"}>
                    {estimates.newPositionHealth}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-900/20 border-blue-700">
            <Info className="h-4 w-4 !text-blue-400" />
            <AlertDescription className="text-blue-300">
              bUSDC tokens represent your share of the USDC pool. They automatically earn yield and can be redeemed for USDC plus accrued interest.
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
              onClick={handleSupplyUSDC}
              disabled={!walletAddress || !supplyAmount || Number(supplyAmount) <= 0 || loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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