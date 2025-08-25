"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplyUSDCModal } from "../components/SupplyUSDCModal";
import { ProvideLiquidityModal } from "../components/ProvideLiquidityModal";
import Image from "next/image";

export default function LenderPoolPage() {
  // Modal states
  const [showSupplyUSDCModal, setShowSupplyUSDCModal] = useState(false);
  const [showProvideLiquidityModal, setShowProvideLiquidityModal] =
    useState(false);

  // Mock pool data for the modals
  const mockPoolData = {
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

  const assets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "/img/tokens/usdc.png",
      supplied: "$856,234",
      supplyValue: "$856,234",
      apy: "4.2%",
      reserve: "Reserve 1",
      reserveColor: "text-green-400",
    },
    {
      symbol: "XLM",
      name: "Stellar Lumens",
      icon: "/img/tokens/xlm.png",
      supplied: "$234,567",
      supplyValue: "$234,567",
      apy: "3.8%",
      reserve: "Reserve 2",
      reserveColor: "text-red-400",
    },
    {
      symbol: "TBRG",
      name: "TrustBridge Token",
      icon: "/img/tokens/tbt.png",
      supplied: "$154,877",
      supplyValue: "$154,877",
      apy: "5.1%",
      reserve: "Reserve 3",
      reserveColor: "text-green-400",
    },
  ];

  const lenderBenefits = [
    "Earn competitive yields on your crypto assets",
    "Automatic compound interest",
    "Withdraw anytime with no lock-up periods",
    "Diversified risk across multiple reserves",
  ];

  const howItWorks = [
    "Supply assets to earn interest from borrowers",
    "Interest rates adjust based on supply and demand",
    "Your funds are secured by over-collateralization",
    "Track your earnings in real-time",
  ];

  // Modal handlers
  const openSupplyUSDCModal = () => setShowSupplyUSDCModal(true);
  const closeSupplyUSDCModal = () => setShowSupplyUSDCModal(false);
  const openProvideLiquidityModal = () => setShowProvideLiquidityModal(true);
  const closeProvideLiquidityModal = () => setShowProvideLiquidityModal(false);

  const handleSupplySuccess = () => {
    closeSupplyUSDCModal();
    // You can add success notification here
  };

  return (
    <main className="mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex w-full justify-between space-y-2">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">
              TrustBridge-MicroLoans Pool
            </h1>
            <p className="text-sm text-gray-400 font-mono">
              Oracle:
              CCYHURAC...CCTHURACSYTNZ2U6SUUSF245AGURQOQ4FC7B1LN5DMLRTLCC4H44
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-100 bg-gray-800 p-1.5 rounded-md">
              4 Max Positions
            </span>
            <span className="text-gray-100 bg-gray-800 p-1.5 rounded-md">
              15% Backstop Rate
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="supply" className="w-full">
          <TabsList className="bg-neutral-800 border-neutral-700">
            <TabsTrigger
              value="supply"
              className="text-[#35bb64] data-[state=active]:bg-neutral-800 data-[state=active]:text-[#35bb64]"
            >
              Supply & Earn
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-neutral-800"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-neutral-800"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supply" className="space-y-6">
            {/* Assets Table */}
            <Card className="card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Asset
                        </th>
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Supplied
                        </th>
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Supply APY
                        </th>
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => (
                        <tr
                          key={asset.symbol}
                          className="border-b border-neutral-700/50 hover:bg-neutral-700/30"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={asset.icon}
                                alt={asset.name}
                                width={24}
                                height={24}
                              />
                              <div>
                                <div className="font-semibold text-white">
                                  {asset.symbol}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {asset.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">
                              {asset.supplied}
                            </div>
                            <div className="text-sm text-gray-400">
                              {asset.supplyValue}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[#35bb64] font-semibold">
                              {asset.apy}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={`${asset.symbol === "XLM" ? "text-red-500 border-red-500" : "text-[#35bb64] border-[#35bb64]"} border-current`}
                            >
                              {asset.reserve}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Amount Input Section */}
            <Card className="card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-gray-400">USDC</span>
                  </div>
                  <div className="text-3xl font-bold text-white">0.00</div>
                  <div className="flex gap-3">
                    <Button
                      className="bg-[#35bb64] hover:bg-[#2da354] text-white"
                      onClick={openSupplyUSDCModal}
                    >
                      Supply USDC
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#35bb64] text-[#35bb64] hover:bg-[#35bb64] hover:text-white bg-transparent"
                      onClick={openProvideLiquidityModal}
                    >
                      Provide Liquidity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-[#35bb64] text-3xl">
                    Lender Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lenderBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#35bb64] mt-1">•</span>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-[#35bb64] text-3xl">
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {howItWorks.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#35bb64] mt-1">•</span>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-6">
                <p className="text-gray-400">
                  Analytics dashboard coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-6">
                <p className="text-gray-400">
                  Transaction history will be displayed here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <SupplyUSDCModal
        isOpen={showSupplyUSDCModal}
        onClose={closeSupplyUSDCModal}
        onSuccess={handleSupplySuccess}
      />
      <ProvideLiquidityModal
        isOpen={showProvideLiquidityModal}
        onClose={closeProvideLiquidityModal}
        poolData={mockPoolData}
      />
    </main>
  );
}
