"use client";

import Image from "next/image";
import StatCard from "../cards/StatCard";
import { useDashboard } from "../../hooks/useDashboard.hook";
import { formatCurrency } from "@/helpers/user-positions.helper";
import { useState } from "react";

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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManagePosition = () => {
    alert(
      "Position management functionality will be implemented in the full version.",
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real implementation, you would trigger a refetch here
      window.location.reload();
    }, 1000);
  };

  // Create hover content for breakdown
  const createBreakdownContent = (positions: typeof userPositions, type: 'supplied' | 'borrowed') => {
    const relevantPositions = positions.filter(pos => pos[type] > 0);
    
    if (relevantPositions.length === 0) {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No {type} positions yet
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Start by supplying or borrowing assets
          </p>
        </div>
      );
    }

    return (
      <div>
        <h4 className="font-medium text-sm mb-2">Breakdown:</h4>
        {relevantPositions.map((pos, index) => (
          <div key={index} className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">{pos.symbol}:</span>
            <span className="font-medium">{formatCurrency(pos[type])}</span>
          </div>
        ))}
      </div>
    );
  };

  // Get wallet display name
  const getWalletDisplayName = () => {
    if (!address) return "Usuario";
    if (walletName) return walletName;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Check if any card is loading
  const isAnyCardLoading = Object.values(cardsLoading).some(loading => loading);

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido de vuelta, <span className="text-success">{getWalletDisplayName()}</span>
          </h1>
          <p className="text-gray-400">
            Revisa tus posiciones y actividad en un solo lugar
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isAnyCardLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            isRefreshing || isAnyCardLoading
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <i className={`fas fa-sync-alt ${isRefreshing ? 'animate-spin' : ''}`}></i>
          <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
        </button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Supplied"
          value={formatCurrency(totalSupplied)}
          change="+1.8%"
          changeType="positive"
          icon="fas fa-coins"
          loading={cardsLoading.totalSupplied}
          hoverContent={createBreakdownContent(userPositions, 'supplied')}
        />
        <StatCard
          title="Total Borrowed"
          value={formatCurrency(totalBorrowed)}
          change="+0.5%"
          changeType="positive"
          icon="fas fa-hand-holding-dollar"
          loading={cardsLoading.totalBorrowed}
          hoverContent={createBreakdownContent(userPositions, 'borrowed')}
        />
        <StatCard
          title="Balance Disponible"
          value={formatCurrency(availableBalance)}
          icon="fas fa-sack-dollar"
          loading={cardsLoading.availableBalance}
          subtitle="Available for new positions"
        />
        <StatCard
          title="Préstamos Activos"
          value={activeLoans.toString()}
          icon="fas fa-file-contract"
          loading={cardsLoading.activeLoans}
          subtitle={`${activeLoans} active loan${activeLoans !== 1 ? 's' : ''}`}
        />
      </div>

      {/* Activity Chart */}
      <div className="card p-6 mb-8" style={{ height: "300px" }}>
        <h2 className="text-lg font-medium mb-4">Actividad Reciente</h2>
        <div className="flex items-center justify-center h-5/6 text-gray-400">
          <div className="text-center">
            <i className="fas fa-chart-line text-4xl mb-3"></i>
            <p>Gráfica de actividad cargando...</p>
          </div>
        </div>
      </div>

      {/* Current Positions Table */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Posiciones Actuales</h2>
          {userPositions.length > 0 && (
            <div className="text-sm text-gray-500">
              {userPositions.length} position{userPositions.length !== 1 ? 's' : ''}
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
                      <p className="text-lg font-medium mb-2">No positions yet</p>
                      <p className="text-sm">Start by supplying assets or taking out loans</p>
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
                              // Fallback to a default icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hidden">
                            <i className="fas fa-coins text-gray-500 text-sm"></i>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {position.symbol === 'USDC' ? 'USD Coin' : 
                             position.symbol === 'XLM' ? 'Stellar Lumens' : 
                             'TrustBridge Token'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">
                        {position.supplied > 0 ? formatCurrency(position.supplied) : 
                         position.borrowed > 0 ? formatCurrency(position.borrowed) : '-'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {position.supplied > 0 && position.borrowed > 0 ? 
                         `Supplied: ${formatCurrency(position.supplied)} | Borrowed: ${formatCurrency(position.borrowed)}` :
                         position.supplied > 0 ? 'Supplied' : 'Borrowed'}
                      </div>
                    </td>
                    <td>
                      <div className="text-success font-medium">{position.apy}%</div>
                    </td>
                    <td>
                      <div className="text-xs">
                        {position.collateral ? 'Sí (75%)' : '-'}
                      </div>
                    </td>
                    <td>
                      <div className={`text-xs inline-block px-2 py-1 rounded ${
                        position.collateral 
                          ? 'bg-blue-900 bg-opacity-20 text-blue-400' 
                          : position.supplied > 0 
                            ? 'bg-green-900 bg-opacity-20 text-green-400'
                            : 'bg-orange-900 bg-opacity-20 text-orange-400'
                      }`}>
                        {position.collateral ? 'Collateral' : 
                         position.supplied > 0 ? 'Activo' : 'Borrowed'}
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
