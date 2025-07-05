"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import {
  TOKENS,
  NETWORK_CONFIG,
  TRUSTBRIDGE_POOL_ID,
} from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";
import { PoolContractV2, RequestType } from "@blend-capital/blend-sdk";
import { TransactionBuilder, xdr, rpc } from "@stellar/stellar-sdk";

interface UseSupplyProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useSupply({ isOpen, onClose, onSuccess }: UseSupplyProps) {
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
      const newPositionHealth = Math.min(100, 85 + amount / 1000); // Health improves with supply

      setEstimates((prev) => ({
        ...prev,
        expectedBTokens: Math.round(expectedBTokens * 100) / 100,
        newPositionHealth: Math.round(newPositionHealth * 100) / 100,
      }));
    } else {
      setEstimates((prev) => ({
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
      const operation = xdr.Operation.fromXDR(supplyOpXdr, "base64");

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: "1000000", // Higher fee for Soroban operations
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
      const assembledTx = rpc
        .assembleTransaction(transaction, simulationResult)
        .build();

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
                `Successfully supplied ${supplyAmount} USDC! You received ~${estimates.expectedBTokens} bUSDC tokens.`,
              );
              setSupplyAmount("");
              onSuccess?.();
              onClose();
            } else if (
              txResult.status === rpc.Api.GetTransactionStatus.FAILED
            ) {
              clearInterval(pollInterval);
              throw new Error(`Transaction failed: ${txResult.resultMetaXdr}`);
            }
          } catch (pollError) {
            console.error("Polling error:", pollError);
          }

          attempts++;
          if (attempts > 30) {
            // 30 attempts = 1 minute
            clearInterval(pollInterval);
            throw new Error("Transaction confirmation timeout");
          }
        }, 2000);
      } else {
        throw new Error(
          `Transaction failed: ${result.errorResult || "Unknown error"}`,
        );
      }
    } catch (error: unknown) {
      console.error("Supply transaction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Handle specific Blend protocol errors
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes("Error(Contract, #1206)")) {
        userFriendlyMessage =
          "Pool is not currently active. The TrustBridge pool may need to be activated by the admin or require additional backstop funding. Please check back later or contact support.";
      } else if (errorMessage.includes("Error(Contract, #1202)")) {
        userFriendlyMessage =
          "Pool is not active yet. Please wait for pool activation.";
      } else if (errorMessage.includes("Error(Contract, #1203)")) {
        userFriendlyMessage =
          "USDC reserve is not enabled. Please contact support.";
      } else if (errorMessage.includes("Error(Contract, #1205)")) {
        userFriendlyMessage =
          "Pool supply cap reached. Please try a smaller amount.";
      } else if (errorMessage.includes("Simulation failed")) {
        userFriendlyMessage =
          "Transaction simulation failed. Please ensure you have sufficient USDC balance and the pool is active.";
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

  // Check if supply button should be disabled
  const isSupplyDisabled =
    !walletAddress || !supplyAmount || Number(supplyAmount) <= 0 || loading;

  return {
    // State
    supplyAmount,
    loading,
    estimates,

    // Actions
    setSupplyAmount,
    handleSupplyUSDC,

    // Computed values
    isSupplyDisabled,

    // Wallet
    walletAddress,
  };
}
