'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, AlertCircle, Zap } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  supplied: string;
  suppliedUSD: string;
  supplyAPY: string;
  totalSupply: string;
  totalSupplyUSD: string;
  utilization: string;
  canSupply: boolean;
}

export default function LenderMarketplacePage() {
  const [assets] = useState<Asset[]>([
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      supplied: '1,234,567',
      suppliedUSD: '$1,234,567',
      supplyAPY: '8.5%',
      totalSupply: '2,500,000',
      totalSupplyUSD: '$2,500,000',
      utilization: '65%',
      canSupply: true
    },
    {
      symbol: 'XLM',
      name: 'Stellar Lumens',
      icon: '⭐',
      supplied: '890,123',
      suppliedUSD: '$101,000',
      supplyAPY: '12.3%',
      totalSupply: '1,500,000',
      totalSupplyUSD: '$170,000',
      utilization: '72%',
      canSupply: true
    },
    {
      symbol: 'TBRG',
      name: 'TrustBridge Token',
      icon: '🌉',
      supplied: '456,789',
      suppliedUSD: '$60,400',
      supplyAPY: '15.8%',
      totalSupply: '800,000',
      totalSupplyUSD: '$105,600',
      utilization: '85%',
      canSupply: true
    }
  ]);

  const [totalEarnings] = useState('$12,456');
  const [totalSupplied] = useState('$1,395,967');
  const [avgAPY] = useState('12.2%');
  const [amount, setAmount] = useState('0.00');

  const handleSupply = (asset: Asset) => {
    console.log(`Opening supply modal for ${asset.symbol}...`);
  };

  const handleQuickSupply = () => {
    console.log('Opening quick supply modal...');
  };

  const handleProvideLiquidity = () => {
    console.log('Opening liquidity provision modal...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
    
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">TrustBridge Lending Pool</h1>
        <p className="text-gray-400 text-sm">
          Contract: CDLZFC4S...UNAVH2EC4AH84
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-yellow-500 text-sm">Total Value Locked: $1.2M</span>
          <span className="text-green-500 text-sm">15% Max APY Available</span>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mb-8">
        <button className="text-blue-500 border-b-2 border-blue-500 px-4 py-2 font-medium">
          Supply & Earn
        </button>
        <button className="text-gray-400 px-4 py-2 hover:text-white">
          Analytics
        </button>
        <button className="text-gray-400 px-4 py-2 hover:text-white">
          History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={24} />
            <span className="text-gray-400 text-sm">Total Earnings</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{totalEarnings}</div>
          <div className="text-sm text-green-300 mt-1">+15.2% this month</div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="text-blue-400" size={24} />
            <span className="text-gray-400 text-sm">Total Supplied</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{totalSupplied}</div>
          <div className="text-sm text-blue-300 mt-1">Across 3 assets</div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-400" size={24} />
            <span className="text-gray-400 text-sm">Average APY</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{avgAPY}</div>
          <div className="text-sm text-purple-300 mt-1">Weighted average</div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Asset</th>
              <th className="text-left p-4 text-gray-300 font-medium">Supplied</th>
              <th className="text-left p-4 text-gray-300 font-medium">Supply APY</th>
              <th className="text-left p-4 text-gray-300 font-medium">Total Supply</th>
              <th className="text-left p-4 text-gray-300 font-medium">Utilization</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
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
                  <div className="text-white font-medium">{asset.supplied}</div>
                  <div className="text-sm text-gray-400">{asset.suppliedUSD}</div>
                </td>
                <td className="p-4">
                  <span className="text-green-400 font-medium">{asset.supplyAPY}</span>
                </td>
                <td className="p-4">
                  <div className="text-blue-400 font-medium">{asset.totalSupply}</div>
                  <div className="text-sm text-gray-400">{asset.totalSupplyUSD}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{ width: asset.utilization }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">{asset.utilization}</span>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleSupply(asset)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Supply {asset.symbol}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amount Input Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Amount to Supply</span>
          <span className="text-white">{amount} USDC</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
          step="0.01"
          min="0"
          placeholder="0.00"
        />
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleSupply(assets[0])}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Supply USDC
          </button>
          <button
            onClick={handleQuickSupply}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            Quick Supply
          </button>
          <button
            onClick={handleProvideLiquidity}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Provide Liquidity
          </button>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-blue-500 font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Lending Benefits
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Earn passive income on your crypto assets</li>
            <li>• High APY rates up to 15.8%</li>
            <li>• Withdraw your funds anytime</li>
            <li>• Automated compound interest</li>
            <li>• No minimum deposit requirements</li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-yellow-500 font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            Risk Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Smart contract risks may apply</li>
            <li>• APY rates are variable and may change</li>
            <li>• Higher utilization may affect withdrawals</li>
            <li>• Consider diversifying across multiple assets</li>
            <li>• Monitor market conditions regularly</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <PieChart size={20} />
          Your Lending Portfolio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">$456.78</div>
            <div className="text-sm text-gray-400">Monthly Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
            <div className="text-sm text-gray-400">Active Positions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">94 days</div>
            <div className="text-sm text-gray-400">Average Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
}