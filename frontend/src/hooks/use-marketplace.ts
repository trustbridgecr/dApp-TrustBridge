"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWalletContext } from "@/providers/wallet.provider";
import {
  POOL_CONFIG,
  ORACLE_ID,
  TRUSTBRIDGE_POOL_ID,
} from "@/config/contracts";
import {
  deployTrustBridgePool,
  supplyUSDCToPool,
} from "@/helpers/pool-deployment.helper";
import { kit } from "@/config/wallet-kit";
import { usePoolData } from "@/hooks/usePoolData";

// Pool Data Interface
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

export function useMarketplace() {
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [supplying, setSupplying] = useState(false);
  const [deployedPoolId, setDeployedPoolId] = useState<string | null>(
    TRUSTBRIDGE_POOL_ID,
  );
  const [supplyAmount, setSupplyAmount] = useState("");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showSupplyUSDCModal, setShowSupplyUSDCModal] = useState(false);
  const [showSupplyXLMModal, setShowSupplyXLMModal] = useState(false);
  const [showProvideLiquidityModal, setShowProvideLiquidityModal] =
    useState(false);

  // Use real-time pool data from hook
  const realTimePoolData = usePoolData();

  // Mock data for compatibility (can be removed later)
  const mockPoolData: PoolData = {
    name: "TrustBridge Pool",
    totalSupplied: "1,245,678",
    totalBorrowed: "867,432",
    utilizationRate: "69.6",
    reserves: [
      {
        symbol: "USDC",
        supplied: "856,234",
        borrowed: "589,432",
        supplyAPY: "4.2",
        borrowAPY: "6.8",
      },
      {
        symbol: "XLM",
        supplied: "234,567",
        borrowed: "156,789",
        supplyAPY: "3.8",
        borrowAPY: "7.2",
      },
      {
        symbol: "TBRG",
        supplied: "154,877",
        borrowed: "121,211",
        supplyAPY: "5.1",
        borrowAPY: "8.4",
      },
    ],
  };

  useEffect(() => {
    // Use real-time pool data loading state
    setLoading(realTimePoolData.loading);
  }, [realTimePoolData.loading]);

  const handleDeployPool = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setDeploying(true);
    try {
      // Create a kit wrapper that includes the server
      const kitWrapper = {
        ...kit,
        server: new (await import("@stellar/stellar-sdk")).rpc.Server(
          "https://soroban-testnet.stellar.org:443",
        ),
        signTransaction: async (txXdr: string) => {
          const { signedTxXdr } = await kit.signTransaction(txXdr, {
            networkPassphrase: "Test SDF Network ; September 2015",
          });
          return (
            await import("@stellar/stellar-sdk")
          ).TransactionBuilder.fromXDR(
            signedTxXdr,
            "Test SDF Network ; September 2015",
          );
        },
      };

      const result = await deployTrustBridgePool(
        kitWrapper as unknown as typeof kit,
        walletAddress,
      );

      if (result.success) {
        setDeployedPoolId(result.poolAddress || "");
        toast.success(
          "Pool deployed successfully! You can now supply USDC and enable borrowing.",
        );
      } else {
        toast.error(`Pool deployment failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Pool deployment failed:", error);
      toast.error("Unexpected error during pool deployment");
    } finally {
      setDeploying(false);
    }
  };

  const handleSupplyToPool = async () => {
    if (!walletAddress || !deployedPoolId || !supplyAmount) {
      toast.error(
        "Please connect wallet, deploy pool, and enter supply amount",
      );
      return;
    }

    setSupplying(true);
    try {
      await supplyUSDCToPool(
        deployedPoolId,
        Number.parseFloat(supplyAmount),
        walletAddress,
      );
      setSupplyAmount("");
      toast.success(
        "USDC supplied successfully! Users can now borrow from the pool.",
      );
    } catch (error) {
      console.error("Supply failed:", error);
    } finally {
      setSupplying(false);
    }
  };

  // Modal handlers
  const openBorrowModal = () => setShowBorrowModal(true);
  const closeBorrowModal = () => setShowBorrowModal(false);

  const openSupplyUSDCModal = () => setShowSupplyUSDCModal(true);
  const closeSupplyUSDCModal = () => setShowSupplyUSDCModal(false);

  const openSupplyXLMModal = () => setShowSupplyXLMModal(true);
  const closeSupplyXLMModal = () => setShowSupplyXLMModal(false);

  const openProvideLiquidityModal = () => setShowProvideLiquidityModal(true);
  const closeProvideLiquidityModal = () => setShowProvideLiquidityModal(false);

  // Success handlers
  const handleSupplySuccess = () => {
    realTimePoolData.refetch();
  };

  // Computed values
  const isWalletConnected = !!walletAddress;
  const isPoolDeployed = !!deployedPoolId;
  const canSupplyToPool = isWalletConnected && isPoolDeployed && supplyAmount;
  const canDeployPool = isWalletConnected && !deploying;
  const canInteractWithPool = isWalletConnected && isPoolDeployed;

  return {
    // State
    loading,
    deploying,
    supplying,
    deployedPoolId,
    supplyAmount,
    showBorrowModal,
    showSupplyUSDCModal,
    showSupplyXLMModal,
    showProvideLiquidityModal,

    // Data
    mockPoolData,
    realTimePoolData,
    walletAddress,

    // Config
    POOL_CONFIG,
    ORACLE_ID,

    // Actions
    setSupplyAmount,
    handleDeployPool,
    handleSupplyToPool,

    // Modal handlers
    openBorrowModal,
    closeBorrowModal,
    openSupplyUSDCModal,
    closeSupplyUSDCModal,
    openSupplyXLMModal,
    closeSupplyXLMModal,
    openProvideLiquidityModal,
    closeProvideLiquidityModal,

    // Success handlers
    handleSupplySuccess,

    // Computed values
    isWalletConnected,
    isPoolDeployed,
    canSupplyToPool,
    canDeployPool,
    canInteractWithPool,
  };
} 