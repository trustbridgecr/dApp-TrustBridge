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

interface UseSupplyCollateralProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useSupplyCollateral({
  isOpen,
  onClose,
  onSuccess,
}: UseSupplyCollateralProps) {
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
      const pool = new PoolContractV2(TRUSTBRIDGE_POOL_ID);
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
      const operation = xdr.Operation.fromXDR(collateralOpXdr, "base64");

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
              `Successfully supplied ${collateralAmount} XLM as collateral! Borrowing power: $${estimates.borrowingPower}`,
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
        if (attempts > 30) {
          // 30 attempts = 1 minute
          clearInterval(pollInterval);
          throw new Error("Transaction confirmation timeout");
        }
      }, 2000);
    } catch (error: unknown) {
      console.error("Collateral transaction failed:", error);
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
          "XLM reserve is not enabled. Please contact support.";
      } else if (errorMessage.includes("Error(Contract, #1205)")) {
        userFriendlyMessage =
          "Insufficient pool liquidity. Please try a smaller amount or wait for more liquidity.";
      } else if (errorMessage.includes("Simulation failed")) {
        userFriendlyMessage =
          "Transaction simulation failed. Please ensure you have sufficient XLM balance and the pool is active.";
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

  // Health factor calculations
  const isHealthy = estimates.healthFactor >= 1.5;
  const isAtRisk =
    estimates.healthFactor < 1.5 && estimates.healthFactor >= 1.2;
  const showHealthWarning =
    estimates.healthFactor > 0 && estimates.healthFactor < 1.5;

  // Check if supply button should be disabled
  const isSupplyDisabled =
    !walletAddress ||
    !collateralAmount ||
    Number(collateralAmount) <= 0 ||
    loading;

  return {
    // State
    collateralAmount,
    loading,
    estimates,

    // Actions
    setCollateralAmount,
    handleSupplyCollateral,

    // Computed values
    isHealthy,
    isAtRisk,
    showHealthWarning,
    isSupplyDisabled,

    // Wallet
    walletAddress,
  };
}
