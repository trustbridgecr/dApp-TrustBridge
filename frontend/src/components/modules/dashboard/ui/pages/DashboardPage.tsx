"use client";

import Image from "next/image";
import StatCard from "../cards/StatCard";
import RecentActivityFeed from "../activity/RecentActivityFeed";
import { useDashboard } from "../../hooks/useDashboard.hook";
import {
  formatCurrency,
  UserPosition,
  POOL_CONFIG,
  getPoolTypeForAsset,
} from "@/helpers/user-positions.helper";
import { DollarSignIcon, File, HandCoins, PiggyBank } from "lucide-react";

export default function Dashboard() {
  const {
    address,
    walletName,
    totalSupplied,
    totalBorrowed,
    availableBalance,
    activeLoans,
    userPositions,
    cardsLoading,
    error,
  } = useDashboard();

  const handleManagePosition = () => {
    alert(
      "Position management functionality will be implemented in the full version.",
    );
  };

  // Create breakdown content for tooltips
  const createBreakdownContent = (
    positions: UserPosition[],
    type: "supplied" | "borrowed",
  ) => {
    if (!positions || positions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const filteredPositions = positions.filter((pos) => pos[type] > 0);

    if (filteredPositions.length === 0) {
      return <div className="text-gray-400">No {type} positions</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {filteredPositions.map((position) => (
          <div key={position.asset} className="flex justify-between text-xs">
            <span className="text-gray-400">{position.symbol}:</span>
            <span className="text-white">{formatCurrency(position[type])}</span>
          </div>
        ))}
      </div>
    );
  };

  // Create Available Balance breakdown content
  const createAvailableBalanceContent = () => {
    if (!userPositions || userPositions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const availableByAsset = userPositions
      .map((position) => {
        const walletBalanceForAsset = 0; // TODO: Get actual wallet balance for this asset
        const available = Math.max(
          0,
          walletBalanceForAsset + position.supplied - position.borrowed,
        );

        return {
          symbol: position.symbol,
          available: available,
          walletBalance: walletBalanceForAsset,
          supplied: position.supplied,
          borrowed: position.borrowed,
        };
      })
      .filter((asset) => asset.available > 0);

    if (availableByAsset.length === 0) {
      return <div className="text-gray-400">No available balance</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {availableByAsset.map((asset) => (
          <div key={asset.symbol} className="flex justify-between text-xs">
            <span className="text-gray-400">{asset.symbol}:</span>
            <span className="text-white">
              {formatCurrency(asset.available)}
            </span>
          </div>
        ))}
        {availableByAsset.some((asset) => asset.walletBalance > 0) && (
          <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-700">
            Includes wallet balance
          </div>
        )}
      </div>
    );
  };

  // Create Active Loans breakdown content
  const createActiveLoansContent = () => {
    if (!userPositions || userPositions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const poolLoanCounts: Record<string, number> = {};
    Object.keys(POOL_CONFIG).forEach((poolType) => {
      poolLoanCounts[poolType] = 0;
    });

    userPositions.forEach((position) => {
      if (position.borrowed > 0) {
        const poolType = getPoolTypeForAsset(position.symbol);
        if (poolType) {
          poolLoanCounts[poolType]++;
        }
      }
    });

    const poolsWithLoans = Object.entries(poolLoanCounts)
      .filter(([, count]) => count > 0)
      .map(([poolType, count]) => ({
        poolType: poolType === "MAIN_POOL" ? "Main Pool" : "Secondary Pool",
        count,
      }));

    if (poolsWithLoans.length === 0) {
      return <div className="text-gray-400">No active loans</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {poolsWithLoans.map((pool) => (
          <div key={pool.poolType} className="flex justify-between text-xs">
            <span className="text-gray-400">{pool.poolType}:</span>
            <span className="text-white">{pool.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const getWalletDisplayName = () => {
    if (!address) return "Usuario";
    if (walletName) return walletName;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenido de vuelta,{" "}
          <span className="text-success">{getWalletDisplayName()}</span>
        </h1>
        <p className="text-gray-400">
          Revisa tus posiciones y actividad en un solo lugar
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading dashboard data
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Supplied"
          value={formatCurrency(totalSupplied)}
          icon={<DollarSignIcon size={20} />}
          loading={cardsLoading.totalSupplied}
          hoverContent={createBreakdownContent(userPositions, "supplied")}
          change="+1.8%"
          changeType="positive"
        />
        <StatCard
          title="Total Borrowed"
          value={formatCurrency(totalBorrowed)}
          icon={<HandCoins size={20} />}
          loading={cardsLoading.totalBorrowed}
          hoverContent={createBreakdownContent(userPositions, "borrowed")}
          change="+0.5%"
          changeType="positive"
        />
        <StatCard
          title="Available Balance"
          value={formatCurrency(availableBalance)}
          icon={<PiggyBank size={20} />}
          loading={cardsLoading.availableBalance}
          subtitle="Available for new positions"
          hoverContent={createAvailableBalanceContent()}
          change="-2.1%"
          changeType="negative"
        />
        <StatCard
          title="Active Loans"
          value={activeLoans.toString()}
          icon={<File size={20} />}
          loading={cardsLoading.activeLoans}
          subtitle={`${activeLoans} active loan${activeLoans !== 1 ? "s" : ""}`}
          hoverContent={createActiveLoansContent()}
          change="+0.0%"
          changeType="positive"
        />
      </div>

      {/* Activity Feed (from feat-219) */}
      <RecentActivityFeed />

      {/* Current Positions Table */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Posiciones Actuales</h2>
          {userPositions.length > 0 && (
            <div className="text-sm text-gray-500">
              {userPositions.length} position
              {userPositions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Activo</th>
                <th>Cantidad</th>
                <th>APY</th>
                <th>Colateral</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {userPositions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-wallet text-3xl mb-3 text-gray-300"></i>
                      <p className="text-lg font-medium mb-2">
                        No positions yet
                      </p>
                      <p className="text-sm">
                        Start by supplying assets or taking out loans
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                userPositions.map((position, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={`/img/tokens/${position.symbol.toLowerCase()}.png`}
                            alt={`${position.symbol} Token`}
                            width={32}
                            height={32}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hidden">
                            <i className="fas fa-coins text-gray-500 text-sm"></i>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {position.symbol === "USDC"
                              ? "USD Coin"
                              : position.symbol === "XLM"
                                ? "Stellar Lumens"
                                : "TrustBridge Token"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">
                        {position.supplied > 0
                          ? formatCurrency(position.supplied)
                          : position.borrowed > 0
                            ? formatCurrency(position.borrowed)
                            : "-"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {position.supplied > 0 && position.borrowed > 0
                          ? `Supplied: ${formatCurrency(
                              position.supplied,
                            )} | Borrowed: ${formatCurrency(position.borrowed)}`
                          : position.supplied > 0
                            ? "Supplied"
                            : "Borrowed"}
                      </div>
                    </td>
                    <td>
                      <div className="text-success font-medium">
                        {position.apy}%
                      </div>
                    </td>
                    <td>
                      <div className="text-xs">
                        {position.collateral ? "Sí (75%)" : "-"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`text-xs inline-block px-2 py-1 rounded ${
                          position.collateral
                            ? "bg-blue-900 bg-opacity-20 text-blue-400"
                            : position.supplied > 0
                              ? "bg-green-900 bg-opacity-20 text-green-400"
                              : "bg-orange-900 bg-opacity-20 text-orange-400"
                        }`}
                      >
                        {position.collateral
                          ? "Collateral"
                          : position.supplied > 0
                            ? "Activo"
                            : "Borrowed"}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-secondary text-xs px-2 py-1"
                        onClick={handleManagePosition}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
