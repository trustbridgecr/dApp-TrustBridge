"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import {
  TOKENS,
  TRUSTBRIDGE_POOL_ID,
  NETWORK_CONFIG,
} from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK and Stellar SDK
import { PoolContractV2, RequestType } from "@blend-capital/blend-sdk";
import {
  TransactionBuilder,
  xdr,
  Account,
  BASE_FEE,
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

interface ProvideLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolData: PoolData | null;
}

interface DepositEstimate {
  bTokensEstimated: number;
  supplyAPY: number;
  newHealthFactor: number;
  totalSupplyAfter: number;
  gasFee: number;
}

export function ProvideLiquidityModal({
  isOpen,
  onClose,
  poolData,
}: ProvideLiquidityModalProps) {
  const { walletAddress } = useWalletContext();
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("USDC");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimates, setEstimates] = useState<DepositEstimate>({
    bTokensEstimated: 0,
    supplyAPY: 3.2,
    newHealthFactor: 0,
    totalSupplyAfter: 0,
    gasFee: 0.0001,
  });

  // Available assets for deposit
  const availableAssets = [
    { symbol: "USDC", address: TOKENS.USDC, decimals: 7, apy: 3.2 },
    { symbol: "XLM", address: TOKENS.XLM, decimals: 7, apy: 2.8 },
    { symbol: "TBRG", address: TOKENS.TBRG, decimals: 7, apy: 4.1 },
  ];

  const currentAsset = availableAssets.find(
    (asset) => asset.symbol === selectedAsset,
  );

  // Mock wallet balance
  useEffect(() => {
    if (walletAddress && selectedAsset) {
      const mockBalances = {
        USDC: 5000.0,
        XLM: 15000.0,
        TBRG: 2500.0,
      };
      setWalletBalance(
        mockBalances[selectedAsset as keyof typeof mockBalances] || 0,
      );
    }
  }, [walletAddress, selectedAsset]);

  // Update estimates when deposit amount changes
  useEffect(() => {
    if (depositAmount && Number(depositAmount) > 0 && currentAsset) {
      setEstimating(true);
      setTimeout(() => {
        const amount = Number(depositAmount);
        const exchangeRate = 1.0;
        const bTokensEstimated = amount * exchangeRate;
        setEstimates({
          bTokensEstimated,
          supplyAPY: currentAsset.apy,
          newHealthFactor: Math.max(1.5, 2.5 + amount / 10000),
          totalSupplyAfter:
            Number(poolData?.totalSupplied.replace(/,/g, "") || 0) + amount,
          gasFee: 0.0001,
        });
        setEstimating(false);
      }, 500);
    }
  }, [depositAmount, currentAsset, poolData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, walletBalance - 1);
    setDepositAmount(maxAmount.toString());
  };

  const handlePresetClick = (percentage: number) => {
    const amount = (walletBalance * percentage) / 100;
    setDepositAmount(amount.toFixed(2));
  };

  const buildTransactionFromXDR = async (operationXdr: string) => {
    if (!walletAddress) throw new Error("Wallet not connected");
    try {
      // Get account information from Horizon
      const accountResponse = await fetch(
        `${NETWORK_CONFIG.horizonUrl}/accounts/${walletAddress}`,
      );
      if (!accountResponse.ok) {
        throw new Error(
          "Failed to fetch account information. Please check your wallet connection.",
        );
      }
      const accountData = await accountResponse.json();

      // Create account object
      const account = new Account(walletAddress, accountData.sequence);

      // Parse the operation from XDR
      const operation = xdr.Operation.fromXDR(operationXdr, "base64");

      // Build transaction with proper fee and timeout
      const transaction = new TransactionBuilder(account, {
        fee: (Number.parseInt(BASE_FEE) * 10).toString(), // Increase fee for Soroban operations
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(300) // 5 minutes timeout
        .build();

      return transaction;
    } catch (error) {
      console.error("Error building transaction:", error);
      if (error instanceof Error) {
        if (error.message.includes("account not found")) {
          throw new Error(
            "Account not found. Please ensure your wallet is funded and connected to the correct network.",
          );
        }
        throw new Error(`Failed to build transaction: ${error.message}`);
      }
      throw new Error("Failed to build transaction due to unknown error");
    }
  };

  const validateTransaction = async () => {
    if (!walletAddress || !currentAsset) return false;
    try {
      // Check if wallet is connected
      if (!walletAddress) {
        toast.error("Please connect your wallet first");
        return false;
      }

      // Check balance
      const hasBalance = walletBalance >= Number(depositAmount);
      if (!hasBalance) {
        toast.error(`Insufficient ${selectedAsset} balance`);
        return false;
      }

      // Check if amount is valid
      if (!depositAmount || Number(depositAmount) <= 0) {
        toast.error("Please enter a valid deposit amount");
        return false;
      }

      // Check if pool is deployed
      if (!TRUSTBRIDGE_POOL_ID) {
        toast.error(
          "TrustBridge pool not yet deployed. Please deploy the pool first.",
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating transaction:", error);
      toast.error("Failed to validate transaction");
      return false;
    }
  };

  const handleProvideCapitalLiquidity = async () => {
    setLoading(true);
    try {
      // Validate transaction first
      const isValid = await validateTransaction();
      if (!isValid) {
        setLoading(false);
        return;
      }

      const amountInt = BigInt(Math.floor(Number(depositAmount) * 1e7));

      toast.info("Preparing transaction...");

      // Create the pool contract instance
      const pool = new PoolContractV2(TRUSTBRIDGE_POOL_ID!);

      // Generate the supply operation XDR
      const depositOpXdr = pool.submit({
        from: walletAddress!,
        spender: walletAddress!,
        to: walletAddress!,
        requests: [
          {
            request_type: RequestType.Supply,
            address: currentAsset!.address,
            amount: amountInt,
          },
        ],
      });

      toast.info("Building transaction...");

      // Build the complete transaction
      const transaction = await buildTransactionFromXDR(depositOpXdr);

      toast.info("Please sign the transaction in your wallet...");

      // Sign the transaction
      const signedTx = await signTransaction(transaction);

      // For now, we'll just show success since we don't have full Soroban submission
      // In production, you would submit the transaction to the network
      toast.success(
        `Transaction prepared successfully! ` +
          `You will receive ${estimates.bTokensEstimated.toFixed(4)} b${selectedAsset} tokens.`,
      );

      console.log("Transaction signed successfully:", {
        amount: depositAmount,
        asset: selectedAsset,
        bTokensReceived: estimates.bTokensEstimated,
        supplyAPY: estimates.supplyAPY,
        signedTransaction: signedTx,
      });

      onClose();
    } catch (error) {
      console.error("Deposit transaction failed:", error);
      if (error instanceof Error) {
        if (
          error.message.includes("User rejected") ||
          error.message.includes("rejected")
        ) {
          toast.error("Transaction cancelled by user");
        } else if (error.message.includes("insufficient")) {
          toast.error("Insufficient balance or gas fees");
        } else if (error.message.includes("account not found")) {
          toast.error(
            "Account not found - please check your wallet connection and ensure it's funded",
          );
        } else if (error.message.includes("Failed to fetch account")) {
          toast.error(
            "Unable to connect to Stellar network - please check your connection",
          );
        } else if (error.message.includes("sequence")) {
          toast.error("Transaction sequence error - please try again");
        } else {
          toast.error(`Transaction failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to complete deposit transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setDepositAmount("");
    setSelectedAsset("USDC");
    setEstimates({
      bTokensEstimated: 0,
      supplyAPY: 3.2,
      newHealthFactor: 0,
      totalSupplyAfter: 0,
      gasFee: 0.0001,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const isValidAmount =
    depositAmount &&
    Number(depositAmount) > 0 &&
    Number(depositAmount) <= walletBalance;
  const hasEstimates = isValidAmount && estimates.bTokensEstimated > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-dark-secondary p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-coins text-success text-xl"></i>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Provide Liquidity
              </h3>
              <p className="text-gray-400 text-sm">
                Deposit assets to earn interest and receive bTokens representing
                your share of the pool.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="form-label">Asset</label>
            <div className="grid grid-cols-3 gap-2">
              {availableAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  className={`btn-secondary text-xs ${selectedAsset === asset.symbol ? "btn-primary" : ""}`}
                  onClick={() => setSelectedAsset(asset.symbol)}
                >
                  {asset.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield text-gray-400"></i>
                <span className="text-sm text-gray-400">Wallet Balance</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {walletBalance.toLocaleString()} {selectedAsset}
                </div>
                <div className="text-xs text-gray-400">
                  ~$
                  {(
                    walletBalance * (selectedAsset === "USDC" ? 1 : 0.1)
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="form-label">Amount to Deposit</label>
            <div className="relative">
              <input
                type="text"
                value={depositAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="form-input text-right pr-16"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-success hover:text-green-300"
              >
                MAX
              </button>
            </div>
            {/* Preset Buttons */}
            <div className="flex gap-2 mt-2">
              {[25, 50, 75].map((percentage) => (
                <button
                  key={percentage}
                  className="btn-secondary text-xs flex-1"
                  onClick={() => handlePresetClick(percentage)}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {hasEstimates && (
            <div className="card p-4 border-t border-custom">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-arrow-up text-success"></i>
                <span className="text-sm font-medium text-gray-300">
                  Transaction Preview
                </span>
                {estimating && <div className="loader"></div>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">You will receive:</span>
                  <span className="text-success font-medium">
                    {estimates.bTokensEstimated.toFixed(4)} b{selectedAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply APY:</span>
                  <span className="text-success font-medium">
                    {estimates.supplyAPY.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Gas Fee:</span>
                  <span className="text-white">
                    {estimates.gasFee.toFixed(4)} XLM
                  </span>
                </div>
                <div className="border-t border-custom pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pool Total After:</span>
                    <span className="text-white">
                      ${estimates.totalSupplyAfter.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="p-3 rounded bg-blue-900 bg-opacity-20 border border-blue-700 text-blue-300">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle mt-0.5 text-blue-400"></i>
              <div className="text-sm">
                <strong>bTokens</strong> represent your share of the pool. They
                earn interest automatically and can be redeemed for the
                underlying asset at any time.
              </div>
            </div>
          </div>

          {/* Error States */}
          {depositAmount && Number(depositAmount) > walletBalance && (
            <div className="p-3 rounded bg-red-900 bg-opacity-20 border border-red-700 text-red-300">
              <div className="flex items-start gap-2">
                <i className="fas fa-exclamation-triangle mt-0.5 text-red-400"></i>
                <div className="text-sm">
                  Insufficient balance. You have{" "}
                  {walletBalance.toLocaleString()} {selectedAsset} available.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleProvideCapitalLiquidity}
              disabled={!isValidAmount || loading || !walletAddress}
            >
              {loading ? (
                <>
                  <div className="loader mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right mr-2"></i>
                  Provide Liquidity
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
