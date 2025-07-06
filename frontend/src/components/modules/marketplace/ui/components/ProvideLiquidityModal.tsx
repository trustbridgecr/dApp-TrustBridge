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
  Shield,
  AlertTriangle,
  Loader2,
  Coins,
  Info,
  ArrowRight,
} from "lucide-react";
import { useWalletContext } from "@/providers/wallet.provider";
import { TOKENS, TRUSTBRIDGE_POOL_ID, NETWORK_CONFIG } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

// Import Blend SDK and Stellar SDK
import { PoolContractV2, RequestType } from "@blend-capital/blend-sdk";
import { 
  TransactionBuilder, 
  xdr, 
  Account,
  BASE_FEE
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

export function ProvideLiquidityModal({ isOpen, onClose, poolData }: ProvideLiquidityModalProps) {
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

  const currentAsset = availableAssets.find(asset => asset.symbol === selectedAsset);

  // Mock wallet balance
  useEffect(() => {
    if (walletAddress && selectedAsset) {
      const mockBalances = {
        USDC: 5000.0,
        XLM: 15000.0,
        TBRG: 2500.0,
      };
      setWalletBalance(mockBalances[selectedAsset as keyof typeof mockBalances] || 0);
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
          newHealthFactor: Math.max(1.5, 2.5 + (amount / 10000)),
          totalSupplyAfter: Number(poolData?.totalSupplied.replace(/,/g, '') || 0) + amount,
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
      const accountResponse = await fetch(`${NETWORK_CONFIG.horizonUrl}/accounts/${walletAddress}`);
      if (!accountResponse.ok) {
        throw new Error("Failed to fetch account information. Please check your wallet connection.");
      }
      const accountData = await accountResponse.json();
      
      // Create account object
      const account = new Account(walletAddress, accountData.sequence);
      
      // Parse the operation from XDR
      const operation = xdr.Operation.fromXDR(operationXdr, 'base64');
      
      // Build transaction with proper fee and timeout
      const transaction = new TransactionBuilder(account, {
        fee: (parseInt(BASE_FEE) * 10).toString(), // Increase fee for Soroban operations
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
          throw new Error("Account not found. Please ensure your wallet is funded and connected to the correct network.");
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
        toast.error("TrustBridge pool not yet deployed. Please deploy the pool first.");
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
        `You will receive ${estimates.bTokensEstimated.toFixed(4)} b${selectedAsset} tokens.`
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
        if (error.message.includes("User rejected") || error.message.includes("rejected")) {
          toast.error("Transaction cancelled by user");
        } else if (error.message.includes("insufficient")) {
          toast.error("Insufficient balance or gas fees");
        } else if (error.message.includes("account not found")) {
          toast.error("Account not found - please check your wallet connection and ensure it's funded");
        } else if (error.message.includes("Failed to fetch account")) {
          toast.error("Unable to connect to Stellar network - please check your connection");
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

  const isValidAmount = depositAmount && Number(depositAmount) > 0 && Number(depositAmount) <= walletBalance;
  const hasEstimates = isValidAmount && estimates.bTokensEstimated > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-700 text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-400" />
            Provide Liquidity
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Deposit assets to earn interest and receive bTokens representing your share of the pool.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label className="text-neutral-300 text-sm font-medium">Asset</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableAssets.map((asset) => (
                <Button
                  key={asset.symbol}
                  variant={selectedAsset === asset.symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`${
                    selectedAsset === asset.symbol
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-neutral-800 border-neutral-600 hover:bg-neutral-700 text-neutral-300"
                  }`}
                >
                  {asset.symbol}
                </Button>
              ))}
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-400">Wallet Balance</span>
            </div>
            <div className="text-right">
              <div className="text-neutral-100 font-medium">
                {walletBalance.toLocaleString()} {selectedAsset}
              </div>
              <div className="text-xs text-neutral-500">
                ~${(walletBalance * (selectedAsset === "USDC" ? 1 : 0.1)).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label className="text-neutral-300 text-sm font-medium">
              Amount to Deposit
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={depositAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="bg-neutral-800 border-neutral-600 text-neutral-100 text-right pr-20"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-emerald-400 hover:text-emerald-300"
              >
                MAX
              </Button>
            </div>
            
            {/* Preset Buttons */}
            <div className="flex gap-2">
              {[25, 50, 75].map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(percentage)}
                  className="flex-1 bg-neutral-800 border-neutral-600 hover:bg-neutral-700 text-neutral-300"
                >
                  {percentage}%
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {hasEstimates && (
            <div className="space-y-3 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-neutral-300">Transaction Preview</span>
                {estimating && <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">You will receive:</span>
                  <span className="text-emerald-400 font-medium">
                    {estimates.bTokensEstimated.toFixed(4)} b{selectedAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Supply APY:</span>
                  <span className="text-emerald-400 font-medium">
                    {estimates.supplyAPY.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Estimated Gas Fee:</span>
                  <span className="text-neutral-300">
                    {estimates.gasFee.toFixed(4)} XLM
                  </span>
                </div>
                <Separator className="bg-neutral-600" />
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pool Total After:</span>
                  <span className="text-neutral-300">
                    ${estimates.totalSupplyAfter.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-900/40 border-blue-700 text-blue-300">
            <Info className="h-4 w-4 !text-blue-400" />
            <AlertDescription className="text-sm">
              <strong>bTokens</strong> represent your share of the pool. They earn interest automatically
              and can be redeemed for the underlying asset at any time.
            </AlertDescription>
          </Alert>

          {/* Error States */}
          {depositAmount && Number(depositAmount) > walletBalance && (
            <Alert variant="destructive" className="bg-red-900/40 border-red-700 text-red-300">
              <AlertTriangle className="h-4 w-4 !text-red-400" />
              <AlertDescription>
                Insufficient balance. You have {walletBalance.toLocaleString()} {selectedAsset} available.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-neutral-800 border-neutral-600 hover:bg-neutral-700 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProvideCapitalLiquidity}
              disabled={!isValidAmount || loading || !walletAddress}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Provide Liquidity
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 