'use client';

import React, { useState} from 'react';
import { Shield, AlertTriangle, DollarSign } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  borrowed: string;
  borrowedUSD: string;
  borrowAPY: string;
  available: string;
  availableUSD: string;
  canBorrow: boolean;
  canSupplyCollateral: boolean;
}

export default function BorrowerMarketplacePage() {
  const [assets] = useState<Asset[]>([
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      borrowed: '589,432',
      borrowedUSD: '$589,432',
      borrowAPY: '6.8%',
      available: '266,502',
      availableUSD: '$266,502',
      canBorrow: true,
      canSupplyCollateral: false
    },
    {
      symbol: 'XLM',
      name: 'Stellar Lumens',
      icon: '⭐',
      borrowed: '156,789',
      borrowedUSD: '$17,776',
      borrowAPY: '7.2%',
      available: '77,778',
      availableUSD: '$8,811',
      canBorrow: false,
      canSupplyCollateral: true
    },
    {
      symbol: 'TBRG',
      name: 'TrustBridge Token',
      icon: '🌉',
      borrowed: '141,211',
      borrowedUSD: '$18,666',
      borrowAPY: '8.4%',
      available: '999,999',
      availableUSD: '$132,222',
      canBorrow: false,
      canSupplyCollateral: true
    }
  ]);

  const [collateralRatio] = useState('150%');
  const [totalBorrowed] = useState('$30,153');
  const [totalCollateral] = useState('$45,230');
  const [healthFactor] = useState('1.5');
  const [amount, setAmount] = useState('0.00');

  const handleBorrowUSDC = () => {
    console.log('Opening USDC borrow modal...');
  };

  const handleSupplyCollateral = (asset: Asset) => {
    console.log(`Opening supply modal for ${asset.symbol} collateral...`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">TrustBridge MicroLoans Pool</h1>
        <p className="text-gray-400 text-sm">
          Contract: CDLZFC4S...UNAVH2EC4AH84
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-yellow-500 text-sm">4 Max Positions</span>
          <span className="text-green-500 text-sm">15% Backstop Rate</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-8">
        <button className="text-orange-500 border-b-2 border-orange-500 px-4 py-2 font-medium">
          Borrow & Leverage
        </button>
        <button className="text-gray-400 px-4 py-2 hover:text-white">
          Analytics
        </button>
        <button className="text-gray-400 px-4 py-2 hover:text-white">
          History
        </button>
      </div>

      {/* Assets Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Asset</th>
              <th className="text-left p-4 text-gray-300 font-medium">Borrowed</th>
              <th className="text-left p-4 text-gray-300 font-medium">Borrow APY</th>
              <th className="text-left p-4 text-gray-300 font-medium">Available</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.symbol} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{asset.icon}</span>
                    <div>
                      <div className="font-medium text-white">{asset.symbol}</div>
                      <div className="text-sm text-gray-400">{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white font-medium">{asset.borrowed}</div>
                  <div className="text-sm text-gray-400">{asset.borrowedUSD}</div>
                </td>
                <td className="p-4">
                  <span className="text-red-400 font-medium">{asset.borrowAPY}</span>
                </td>
                <td className="p-4">
                  <div className="text-green-400 font-medium">{asset.available}</div>
                  <div className="text-sm text-gray-400">{asset.availableUSD}</div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {asset.canBorrow && (
                      <button
                        onClick={handleBorrowUSDC}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Borrow {asset.symbol}
                      </button>
                    )}
                    {asset.canSupplyCollateral && (
                      <button
                        onClick={() => handleSupplyCollateral(asset)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Supply {asset.symbol} Collateral
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">{collateralRatio}</div>
            <div className="text-gray-400 text-sm">Collateral Ratio</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">{totalCollateral}</div>
            <div className="text-gray-400 text-sm">Total Collateral</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">{totalBorrowed}</div>
            <div className="text-gray-400 text-sm">Total Borrowed</div>
          </div>
        </div>
      </div>

      {/* Amount Input Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Amount</span>
          <span className="text-white">{amount} USDC</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-orange-500"
          step="0.01"
          min="0"
        />
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBorrowUSDC}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Borrow USDC
          </button>
          <button
            onClick={() => handleSupplyCollateral(assets[1])}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Supply XLM Collateral
          </button>
        </div>
      </div>

      {/* Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Borrowing Benefits */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-orange-500 font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Borrowing Benefits
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Access instant liquidity without selling assets</li>
            <li>• Competitive interest rates</li>
            <li>• Flexible repayment terms</li>
            <li>• Use borrowed funds for trading or investments</li>
          </ul>
        </div>

        {/* Risk Management */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-red-500 font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} />
            Risk Management
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Maintain healthy collateral ratios</li>
            <li>• Monitor liquidation thresholds</li>
            <li>• Set up price alerts for your positions</li>
            <li>• Consider market volatility in your strategy</li>
          </ul>
        </div>
      </div>

      {/* Risk Notice */}
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-500 font-semibold mb-1">Important Risk Notice</h4>
            <p className="text-gray-300 text-sm">
              Borrowing crypto assets involves liquidation risk. Ensure you maintain adequate collateral ratios and understand the risks before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}