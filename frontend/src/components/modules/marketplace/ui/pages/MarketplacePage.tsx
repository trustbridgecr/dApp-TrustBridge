"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  TrendingUp,
  DollarSign,
  Percent,
  Users,
  Shield,
  FlaskConical,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useWalletContext } from "@/providers/wallet.provider";
import { BorrowModal } from "../components/BorrowModal";
import { SupplyUSDCModal } from "../components/SupplyUSDCModal";
import { SupplyXLMCollateralModal } from "../components/SupplyXLMCollateralModal";
import { POOL_CONFIG, ORACLE_ID, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { deployTrustBridgePool, supplyUSDCToPool } from "@/helpers/pool-deployment.helper";
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

export function MarketplacePage() {
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [supplying, setSupplying] = useState(false);
  const [deployedPoolId, setDeployedPoolId] = useState<string | null>(TRUSTBRIDGE_POOL_ID);
  const [supplyAmount, setSupplyAmount] = useState("");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showSupplyUSDCModal, setShowSupplyUSDCModal] = useState(false);
  const [showSupplyXLMModal, setShowSupplyXLMModal] = useState(false);
  
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
        borrowAPY: "6.8"
      },
      {
        symbol: "XLM",
        supplied: "234,567",
        borrowed: "156,789",
        supplyAPY: "3.8",
        borrowAPY: "7.2"
      },
      {
        symbol: "TBRG",
        supplied: "154,877",
        borrowed: "121,211",
        supplyAPY: "5.1",
        borrowAPY: "8.4"
      }
    ]
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
        server: new (await import('@stellar/stellar-sdk')).rpc.Server('https://soroban-testnet.stellar.org:443'),
        signTransaction: async (txXdr: string) => {
          const { signedTxXdr } = await kit.signTransaction(txXdr, {
            networkPassphrase: "Test SDF Network ; September 2015",
          });
          return (await import('@stellar/stellar-sdk')).TransactionBuilder.fromXDR(signedTxXdr, "Test SDF Network ; September 2015");
        }
      };
      
      const result = await deployTrustBridgePool(kitWrapper as unknown as typeof kit, walletAddress);
      
      if (result.success) {
        setDeployedPoolId(result.poolAddress || "");
        toast.success("Pool deployed successfully! You can now supply USDC and enable borrowing.");
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
      toast.error("Please connect wallet, deploy pool, and enter supply amount");
      return;
    }

    setSupplying(true);
    try {
      await supplyUSDCToPool(deployedPoolId, parseFloat(supplyAmount), walletAddress);
      setSupplyAmount("");
      toast.success("USDC supplied successfully! Users can now borrow from the pool.");
      
    } catch (error) {
      console.error("Supply failed:", error);
    } finally {
      setSupplying(false);
    }
  };



  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">
              TrustBridge Marketplace
            </h1>
            <p className="text-neutral-400">
              Decentralized lending pools powered by Blend Protocol
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
          Stellar Testnet
        </Badge>
      </div>

      {/* Wallet Connection Alert */}
      {!walletAddress && (
        <Alert variant="destructive" className="bg-amber-900/40 border-amber-700 text-amber-300">
          <AlertCircle className="h-4 w-4 !text-amber-300" />
          <AlertTitle>Connect Your Wallet</AlertTitle>
          <AlertDescription>
            Please connect your Stellar wallet to interact with the lending pools.
          </AlertDescription>
        </Alert>
      )}

      {/* Pool Configuration Information */}
      {walletAddress && deployedPoolId && (
        <Alert className="bg-green-900/40 border-green-700 text-green-300">
          <AlertCircle className="h-4 w-4 !text-green-300" />
          <AlertTitle>Pool Ready for Lending</AlertTitle>
          <AlertDescription>
            Pool deployed successfully! You can now supply USDC to provide liquidity and users can borrow from the pool. The pool is configured with USDC reserves and ready for operation.
          </AlertDescription>
        </Alert>
      )}



      {/* Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Supplied</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">${mockPoolData?.totalSupplied}</div>
            <p className="text-xs text-emerald-400">+2.1% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Borrowed</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">${mockPoolData?.totalBorrowed}</div>
            <p className="text-xs text-orange-400">+5.3% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Utilization Rate</CardTitle>
            <Percent className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{mockPoolData?.utilizationRate}%</div>
            <p className="text-xs text-blue-400">Optimal range: 50-80%</p>
          </CardContent>
        </Card>
      </div>

      {/* Pool Overview */}
      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              {POOL_CONFIG.name} Pool
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-neutral-300 border-neutral-600">
                {POOL_CONFIG.maxPositions} Max Positions
              </Badge>
              <Badge variant="outline" className="text-neutral-300 border-neutral-600">
                {POOL_CONFIG.backstopRate}% Backstop Rate
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {mockPoolData?.reserves.map((reserve: PoolReserve, index: number) => (
                <div key={reserve.symbol} className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-neutral-200">{reserve.symbol}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Reserve {index + 1}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Supplied:</span>
                      <span className="text-neutral-300">${reserve.supplied}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Borrowed:</span>
                      <span className="text-neutral-300">${reserve.borrowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Supply APY:</span>
                      <span className="text-emerald-400">{reserve.supplyAPY}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Borrow APY:</span>
                      <span className="text-orange-400">{reserve.borrowAPY}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-neutral-900/30 border-t border-neutral-700">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Users className="h-4 w-4" />
            <span>Oracle: {ORACLE_ID.substring(0, 8)}...{ORACLE_ID.substring(-4)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Supply Section - Only show if reserve is configured */}
            {deployedPoolId && (
              <div className="flex items-end gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Supply USDC</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                    className="w-24 h-8 text-sm bg-neutral-800 border-neutral-600 text-neutral-200"
                    min="0"
                    step="1"
                    disabled={supplying}
                  />
                </div>
                <Button
                  onClick={handleSupplyToPool}
                  disabled={!walletAddress || !deployedPoolId || !supplyAmount}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-8"
                >
                  {supplying ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Supplying...
                    </>
                  ) : (
                    "Supply"
                  )}
                </Button>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {!deployedPoolId && (
                <Button
                  onClick={handleDeployPool}
                  disabled={!walletAddress || deploying}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {deploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    "Deploy Pool"
                  )}
                </Button>
              )}
              
              {/* Required Supply/Collateral Buttons */}
              {deployedPoolId && (
                <>
                  <Button
                    onClick={() => setShowSupplyUSDCModal(true)}
                    disabled={!walletAddress}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Supply USDC
                  </Button>
                  
                  <Button
                    onClick={() => setShowSupplyXLMModal(true)}
                    disabled={!walletAddress}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Supply XLM Collateral
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => setShowBorrowModal(true)}
                disabled={!walletAddress || !deployedPoolId}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Borrow USDC
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Borrow Modal */}
      <BorrowModal 
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        poolData={mockPoolData}
        poolId={deployedPoolId || ""}
      />
      
      {/* Supply USDC Modal */}
      <SupplyUSDCModal 
        isOpen={showSupplyUSDCModal}
        onClose={() => setShowSupplyUSDCModal(false)}
        onSuccess={() => realTimePoolData.refetch()}
      />
      
      {/* Supply XLM Collateral Modal */}
      <SupplyXLMCollateralModal 
        isOpen={showSupplyXLMModal}
        onClose={() => setShowSupplyXLMModal(false)}
        onSuccess={() => realTimePoolData.refetch()}
      />
    </div>
  );
} 