"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AlertTriangle, Shield, DollarSign, PieChart } from "lucide-react";

export default function BorrowerPoolPage() {
  const [borrowAmount, setBorrowAmount] = useState("0.00");
  const [selectedAsset, setSelectedAsset] = useState("USDC");

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
      apyColor: "text-red-500",
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
      apyColor: "text-red-500",
    },
    {
      symbol: "TBRG",
      name: "TrustBridge Token",
      icon: "🏛️",
      borrowed: "141,211",
      borrowedValue: "$141,211",
      apy: "8.4%",
      available: "18,666",
      availableValue: "$18,666",
      apyColor: "text-red-500",
    },
  ];

  const poolStats = {
    collateralRatio: "150%",
    totalCollateral: "$45,230",
    totalBorrowed: "$30,153"
  };

  const borrowingBenefits = [
    "Access instant liquidity without selling assets",
    "Competitive borrowing rates",
    "Flexible repayment terms",
    "Use borrowed funds for trading or investments"
  ];

  const riskManagement = [
    "Maintain healthy collateral ratios",
    "Monitor liquidation thresholds",
    "Set up price alerts for your positions",
    "Consider market volatility in your strategy"
  ];

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
              Contract:
              0x742d35Cc6ccF4b1E67B5d2e7DFa3Fc1C2E2FF1f11CcC44A30DCA64F649A2...
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
        <Tabs defaultValue="borrow" className="w-full">
          <TabsList className="bg-neutral-800 border-neutral-700">
            <TabsTrigger
              value="borrow"
              className="text-orange-500 data-[state=active]:bg-neutral-800 data-[state=active]:text-orange-500"
            >
              Borrow & Leverage
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
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-neutral-800"
            >
              Positions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="borrow" className="space-y-6">
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
                          Borrowed
                        </th>
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Borrow APY
                        </th>
                        <th className="text-left p-4 text-gray-400 font-medium">
                          Available
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
                              <span className="text-xl">{asset.icon}</span>
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
                              {asset.borrowed}
                            </div>
                            <div className="text-sm text-gray-400">
                              {asset.borrowedValue}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`font-semibold ${asset.apyColor}`}>
                              {asset.apy}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-[#35bb64]">
                              {asset.available}
                            </div>
                            <div className="text-sm text-gray-400">
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

            {/* Pool Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <PieChart className="w-5 h-5 text-[#35bb64]" />
                    <span className="text-gray-400 text-sm">Collateral Ratio</span>
                  </div>
                  <div className="text-2xl font-bold text-[#35bb64]">{poolStats.collateralRatio}</div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Total Collateral</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{poolStats.totalCollateral}</div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-400 text-sm">Total Borrowed</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-500">{poolStats.totalBorrowed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Amount Input Section */}
            <Card className="card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-gray-400">{selectedAsset}</span>
                  </div>
                  <input
                    type="text"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="text-3xl font-bold text-white bg-transparent outline-none w-full"
                    placeholder="0.00"
                  />
                  <div className="flex gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Borrow {selectedAsset}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#35bb64] text-[#35bb64] hover:bg-[#35bb64] hover:text-white bg-transparent"
                    >
                      Supply XLM Collateral
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-3xl">
                    Borrowing Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {borrowingBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-blue-400 text-3xl">
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskManagement.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Risk Notice */}
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">Important Risk Notice</h4>
                    <p className="text-gray-300 text-sm">
                      Borrowing crypto assets involves liquidation risk. Ensure you maintain adequate collateral ratios and understand the risks before proceeding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          <TabsContent value="positions">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-6">
                <p className="text-gray-400">
                  Your active borrowing positions and collateral status will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}