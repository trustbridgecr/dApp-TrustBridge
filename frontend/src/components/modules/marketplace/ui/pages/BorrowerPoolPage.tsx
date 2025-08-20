"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BorrowModal } from "../components/BorrowModal";
import { SupplyXLMCollateralModal } from "../components/SupplyXLMCollateralModal";

export default function BorrowerPoolPage() {
  const [borrowAmount, setBorrowAmount] = useState("0.00");
  
  // Modal states
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showSupplyCollateralModal, setShowSupplyCollateralModal] = useState(false);

  // Mock pool data for the modals
  const mockPoolData = {
    name: "TrustBridge MicroLoans Pool",
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
      icon: "🔒",
      borrowed: "589,432",
      borrowedValue: "$589,432",
      apy: "6.8%",
      available: "266,802",
      availableValue: "$266,802",
      apyColor: "text-red-400",
      iconBg: "bg-green-500",
      
    },
    {
      symbol: "XLM",
      name: "Stellar Lumens",
      icon: "⭐",
      borrowed: "156,789",
      borrowedValue: "$78,394",
      apy: "7.2%",
      available: "77,778",
      availableValue: "$77,778",
      apyColor: "text-red-400",
      iconBg: "bg-yellow-500",
    },
    {
     symbol: "TBRG",
      name: "TrustBridge Token",
      icon: "🏛️",
      borrowed: "141,211",
      borrowedValue: "$141,211",
      apy: "8.4%",
      available: "999,999",
      availableValue: "$119,222",
      apyColor: "text-red-400",
      iconBg: "bg-purple-500",
    },
  ];

  const poolStats = {
    collateralRatio: "150%",
    totalCollateral: "$45,230",
    totalBorrowed: "$30,153"
  };

  const borrowingBenefits = [
    "Access instant liquidity without selling assets",
    "Competitive interest rates"
  ];

  const riskManagement = [
    "Maintain healthy collateral ratios",
    "Monitor liquidation thresholds"
  ];

  // Modal handlers
  const openBorrowModal = () => setShowBorrowModal(true);
  const closeBorrowModal = () => setShowBorrowModal(false);
  const openSupplyCollateralModal = () => setShowSupplyCollateralModal(true);
  const closeSupplyCollateralModal = () => setShowSupplyCollateralModal(false);


  const handleSupplyCollateralSuccess = () => {
    closeSupplyCollateralModal();
    
  };

  return (
   
      <main className="mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Borrower Dashboard
            </h1>
            <p className="text-gray-300 text-sm">
              Manage your borrowing positions and collateral
            </p>
          </div>

          {/* Pool Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              TrustBridge MicroLoans Pool
            </h2>
            <p className="text-sm text-gray-400 font-mono mb-4">
              Contract: 0x742d35Cc...64A30DCA64F649A2
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-orange-400">4 Max Positions</span>
              <span className="text-green-400">15% Backstop Rate</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="borrow" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-700 rounded-none w-full justify-start h-auto p-0">
              <TabsTrigger
                value="borrow"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-orange-500 rounded-none px-4 py-3"
              >
                Borrow & Leverage
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-orange-500 rounded-none px-4 py-3"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-orange-500 rounded-none px-4 py-3"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="borrow" className="space-y-6 mt-6">
              {/* Assets Table */}
              <Card className="bg-neutral-800 border-neutral-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-700/50 bg-neutral-800/30">
                          <th className="text-left p-4 text-gray-400 font-medium text-sm">Asset</th>
                          <th className="text-left p-4 text-gray-400 font-medium text-sm">Borrowed</th>
                          <th className="text-left p-4 text-gray-400 font-medium text-sm">Borrow APY</th>
                          <th className="text-left p-4 text-gray-400 font-medium text-sm">Available</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset) => (
                          <tr
                            key={asset.symbol}
                            className="border-b border-neutral-700/30 hover:bg-neutral-700/20 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${asset.iconBg} flex items-center justify-center text-white font-bold text-sm`}>
                                  {asset.symbol === "USDC" ? "$" : asset.symbol === "XLM" ? "★" : "T"}
                                </div>
                                <div>
                                  <div className="font-semibold text-white text-sm">
                                    {asset.symbol}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {asset.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-white text-sm">
                                {asset.borrowed}
                              </div>
                              <div className="text-xs text-gray-400">
                                {asset.borrowedValue}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`font-semibold text-sm ${asset.apyColor}`}>
                                {asset.apy}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-green-400 text-sm">
                                {asset.available}
                              </div>
                              <div className="text-xs text-gray-400">
                                {asset.availableValue}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {poolStats.collateralRatio}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Collateral Ratio
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {poolStats.totalCollateral}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Total Collateral
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">
                      {poolStats.totalBorrowed}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Total Borrowed
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Amount Input */}
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">Amount</span>
                    <span className="text-gray-400 text-sm">0.00 USDC</span>
                  </div>
                  <input
                    type="text"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="w-full text-4xl font-bold text-white bg-transparent outline-none placeholder-gray-500"
                    placeholder="0.00"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="bg-orange-600 hover:bg-orange-600 text-white h-12 text-base font-semibold rounded-lg"
                  onClick={openBorrowModal}
                >
                  Borrow USDC
                </Button>

                <Button
                  className="bg-gray-600 hover:bg-gray-500 text-white h-12 text-base font-semibold rounded-lg"
                  onClick={openSupplyCollateralModal}
                >
                  Supply XLM Collateral
                </Button>
              </div>

              {/* Information Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-orange-500 text-lg flex items-center gap-2">
                      💡 Borrowing Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {borrowingBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-neutral-800 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                      ⚠️ Risk Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {riskManagement.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span className="text-sm text-gray-300">{item}</span>
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
              <Card className="bg-slate-800/50 border-slate-700/50">
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
        <BorrowModal
          isOpen={showBorrowModal}
          onClose={closeBorrowModal}
          poolData={mockPoolData}
          poolId="trustbridge-microloans-pool"
        />
        <SupplyXLMCollateralModal
          isOpen={showSupplyCollateralModal}
          onClose={closeSupplyCollateralModal}
          onSuccess={handleSupplyCollateralSuccess}
        />
      </main>
    
  );
}