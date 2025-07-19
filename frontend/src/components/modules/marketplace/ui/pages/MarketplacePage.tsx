"use client";

import { useMarketplace } from "../../hooks/useMarketplace.hook";
import { BorrowModal } from "../components/BorrowModal";
import { ProvideLiquidityModal } from "../components/ProvideLiquidityModal";
import { SupplyUSDCModal } from "../components/SupplyUSDCModal";
import { SupplyXLMCollateralModal } from "../components/SupplyXLMCollateralModal";
// Pool Data Interface
interface PoolReserve {
  symbol: string;
  supplied: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
}

export default function Marketplace() {
  const {
    loading,
    deploying,
    supplying,
    deployedPoolId,
    supplyAmount,
    showBorrowModal,
    showSupplyUSDCModal,
    showSupplyXLMModal,
    showProvideLiquidityModal,
    mockPoolData,
    POOL_CONFIG,
    ORACLE_ID,
    setSupplyAmount,
    handleDeployPool,
    handleSupplyToPool,
    openBorrowModal,
    closeBorrowModal,
    openSupplyUSDCModal,
    closeSupplyUSDCModal,
    openSupplyXLMModal,
    closeSupplyXLMModal,
    openProvideLiquidityModal,
    closeProvideLiquidityModal,
    handleSupplySuccess,
    isWalletConnected,
    isPoolDeployed,
    canSupplyToPool,
    canDeployPool,
    canInteractWithPool,
  } = useMarketplace();

  if (loading) {
    return (
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
        <div className="space-y-8">
          <div className="h-12 w-80 bg-dark-secondary rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full bg-dark-secondary rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-96 w-full bg-dark-secondary rounded animate-pulse"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
      <p className="text-gray-400 mb-6">
        Decentralized lending pools powered by Blend Protocol
      </p>

      {/* Wallet Connection Alert */}
      {!isWalletConnected && (
        <div className="bg-amber-900 bg-opacity-20 border border-amber-700 text-amber-400 px-4 py-3 rounded mb-8 flex items-start">
          <i className="fas fa-exclamation-circle mt-1 mr-3"></i>
          <div>
            <p className="font-medium">Connect Your Wallet</p>
            <p className="text-sm">
              Please connect your Stellar wallet to interact with the lending
              pools.
            </p>
          </div>
        </div>
      )}

      {/* Pool Status Alert */}
      {isWalletConnected && isPoolDeployed && (
        <div className="bg-green-900 bg-opacity-20 border border-green-700 text-green-400 px-4 py-3 rounded mb-8 flex items-start">
          <i className="fas fa-check-circle mt-1 mr-3"></i>
          <div>
            <p className="font-medium">Pool Ready for Lending</p>
            <p className="text-sm">
              Pool deployed successfully! You can now supply USDC to provide
              liquidity and users can borrow from the pool. The pool is
              configured with USDC reserves and ready for operation.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Supplied Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Total Supplied</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold mr-2">
                ${mockPoolData?.totalSupplied || "1,245,678"}
              </span>
              <span className="text-success text-sm flex items-center">
                <i className="fas fa-arrow-up mr-1"></i>
                2.4%
              </span>
            </div>
            <i className="fas fa-coins text-2xl text-gray-500"></i>
          </div>
        </div>
        {/* Total Borrowed Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Total Borrowed</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold mr-2">
                ${mockPoolData?.totalBorrowed || "867,432"}
              </span>
              <span className="text-warning text-sm flex items-center">
                <i className="fas fa-arrow-down mr-1"></i>
                1.2%
              </span>
            </div>
            <i className="fas fa-hand-holding-dollar text-2xl text-gray-500"></i>
          </div>
        </div>
        {/* Utilization Rate Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Utilization Rate</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold mr-2">
                {mockPoolData?.utilizationRate || "69.6"}%
              </span>
              <span className="text-success bg-green-900 bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                Optimal
              </span>
            </div>
            <i className="fas fa-chart-pie text-2xl text-gray-500"></i>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Optimal range: 50-80%
          </div>
        </div>
      </div>

      {/* Pool Card */}
      <div className="card pool-card overflow-hidden mb-8">
        <div className="p-4 flex items-center justify-between cursor-pointer bg-dark-tertiary">
          <div>
            <h2 className="text-lg font-medium">
              {POOL_CONFIG?.name || "TrustBridge-MicroLoans"} Pool
            </h2>
            <div className="text-xs text-gray-400 mt-1">
              Oracle:{" "}
              {ORACLE_ID
                ? `${ORACLE_ID.substring(0, 8)}...${ORACLE_ID.substring(-4)}`
                : "0x7a9f92e53bDFAC9007A40D103852377E984BDDc9"}
            </div>
          </div>
          <div className="flex gap-2">
            {POOL_CONFIG && (
              <>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-600">
                  {POOL_CONFIG.maxPositions} Max Positions
                </span>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-600">
                  {POOL_CONFIG.backstopRate}% Backstop Rate
                </span>
              </>
            )}
          </div>
        </div>

        {/* Pool Content */}
        <div className="p-5">
          {/* Pool Tabs */}
          <div className="tab-buttons flex mb-4">
            <div className="tab-btn active">Supply & Borrow</div>
            <div className="tab-btn">Analytics</div>
            <div className="tab-btn">History</div>
          </div>

          {/* Asset Table */}
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Supplied</th>
                  <th>Borrowed</th>
                  <th>Supply APY</th>
                  <th>Borrow APY</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {mockPoolData?.reserves ? (
                  mockPoolData.reserves.map(
                    (reserve: PoolReserve, index: number) => (
                      <tr key={reserve.symbol}>
                        <td>
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full overflow-hidden ${
                                reserve.symbol === "USDC"
                                  ? "bg-blue-700"
                                  : reserve.symbol === "XLM"
                                    ? "bg-gray-100"
                                    : "bg-gray-800"
                              } flex items-center justify-center mr-3`}
                            >
                              {reserve.symbol === "USDC" ? (
                                <img
                                  src="/img/tokens/usdc.png"
                                  alt="USDC"
                                  className="w-10 h-10object-contain"
                                />
                              ) : reserve.symbol === "XLM" ? (
                                <img
                                  src="/img/tokens/xlm.png"
                                  alt="XLM"
                                  className="bg-white w-5 h-5 object-contain"
                                />
                              ) : (
                                <img
                                  src="/img/tokens/tbt.png"
                                  alt="TrustBridge Token"
                                  className="w-10 h-10 object-contain"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {reserve.symbol}
                              </div>
                              <div className="text-xs text-gray-400">
                                {reserve.symbol === "USDC"
                                  ? "USD Coin"
                                  : reserve.symbol === "XLM"
                                    ? "Stellar Lumens"
                                    : "TrustBridge Token"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">{reserve.supplied}</div>
                          <div className="text-xs text-gray-400">
                            ${reserve.supplied}
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{reserve.borrowed}</div>
                          <div className="text-xs text-gray-400">
                            ${reserve.borrowed}
                          </div>
                        </td>
                        <td>
                          <div className="text-success font-medium">
                            {reserve.supplyAPY}%
                          </div>
                        </td>
                        <td>
                          <div className="text-warning font-medium">
                            {reserve.borrowAPY}%
                          </div>
                        </td>
                        <td>
                          <div
                            className={`${
                              index === 0
                                ? "bg-blue-900 bg-opacity-20 text-blue-400"
                                : index === 1
                                  ? "bg-purple-900 bg-opacity-20 text-purple-400"
                                  : "bg-green-900 bg-opacity-20 text-green-400"
                            } text-xs inline-block px-2 py-1 rounded`}
                          >
                            Reserve {index + 1}
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  // Default rows when no data
                  <>
                    <tr>
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                            <span className="font-bold text-xs">$</span>
                          </div>
                          <div>
                            <div className="font-medium">USDC</div>
                            <div className="text-xs text-gray-400">
                              USD Coin
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">875,000</div>
                        <div className="text-xs text-gray-400">$875,000</div>
                      </td>
                      <td>
                        <div className="font-medium">654,200</div>
                        <div className="text-xs text-gray-400">$654,200</div>
                      </td>
                      <td>
                        <div className="text-success font-medium">3.2%</div>
                      </td>
                      <td>
                        <div className="text-warning font-medium">6.8%</div>
                      </td>
                      <td>
                        <div className="bg-blue-900 bg-opacity-20 text-blue-400 text-xs inline-block px-2 py-1 rounded">
                          Reserve 1
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            <i className="fas fa-rocket text-xs"></i>
                          </div>
                          <div>
                            <div className="font-medium">XLM</div>
                            <div className="text-xs text-gray-400">
                              Stellar Lumens
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">350,000</div>
                        <div className="text-xs text-gray-400">$210,000</div>
                      </td>
                      <td>
                        <div className="font-medium">168,500</div>
                        <div className="text-xs text-gray-400">$101,100</div>
                      </td>
                      <td>
                        <div className="text-success font-medium">2.8%</div>
                      </td>
                      <td>
                        <div className="text-warning font-medium">5.9%</div>
                      </td>
                      <td>
                        <div className="bg-purple-900 bg-opacity-20 text-purple-400 text-xs inline-block px-2 py-1 rounded">
                          Reserve 2
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center mr-3">
                            <i className="fas fa-bridge text-xs"></i>
                          </div>
                          <div>
                            <div className="font-medium">TBRG</div>
                            <div className="text-xs text-gray-400">
                              TrustBridge Token
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">1,250,000</div>
                        <div className="text-xs text-gray-400">$162,500</div>
                      </td>
                      <td>
                        <div className="font-medium">862,550</div>
                        <div className="text-xs text-gray-400">$112,132</div>
                      </td>
                      <td>
                        <div className="text-success font-medium">4.5%</div>
                      </td>
                      <td>
                        <div className="text-warning font-medium">7.2%</div>
                      </td>
                      <td>
                        <div className="bg-green-900 bg-opacity-20 text-green-400 text-xs inline-block px-2 py-1 rounded">
                          Reserve 3
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Actions Section */}
          <div className="mt-6 border-t border-custom pt-6">
            {/* Quick Supply Section */}
            {isPoolDeployed && (
              <div className="mb-4">
                <label htmlFor="amount-input" className="form-label">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount-input"
                    className="form-input pr-12"
                    placeholder="0.00"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                    min="0"
                    step="1"
                    disabled={supplying}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    USDC
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {!isPoolDeployed && (
                <button
                  className="btn-primary"
                  onClick={handleDeployPool}
                  disabled={!canDeployPool}
                >
                  {deploying ? (
                    <>
                      <div className="loader mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-rocket mr-2"></i>
                      Deploy Pool
                    </>
                  )}
                </button>
              )}

              {isPoolDeployed && (
                <button
                  className="btn-primary"
                  onClick={handleSupplyToPool}
                  disabled={!canSupplyToPool}
                >
                  {supplying ? (
                    <>
                      <div className="loader mr-2"></div>
                      Supplying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-bolt mr-2"></i>
                      Quick Supply
                    </>
                  )}
                </button>
              )}

              {isPoolDeployed && (
                <button
                  className="btn-primary"
                  onClick={openSupplyUSDCModal}
                  disabled={!isWalletConnected}
                >
                  <i className="fas fa-arrow-up mr-2"></i>
                  Supply USDC
                </button>
              )}

              {isPoolDeployed && (
                <button
                  className="btn-secondary"
                  onClick={openSupplyXLMModal}
                  disabled={!isWalletConnected}
                >
                  <i className="fas fa-shield mr-2"></i>
                  Supply XLM Collateral
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={openProvideLiquidityModal}
                disabled={!canInteractWithPool}
              >
                <i className="fas fa-droplet mr-2"></i>
                Provide Liquidity
              </button>

              <button
                className="btn-danger"
                onClick={openBorrowModal}
                disabled={!canInteractWithPool}
              >
                <i className="fas fa-arrow-down mr-2"></i>
                Borrow USDC
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BorrowModal
        isOpen={showBorrowModal}
        onClose={closeBorrowModal}
        poolData={mockPoolData}
        poolId={deployedPoolId || ""}
      />
      <SupplyUSDCModal
        isOpen={showSupplyUSDCModal}
        onClose={closeSupplyUSDCModal}
        onSuccess={handleSupplySuccess}
      />
      <SupplyXLMCollateralModal
        isOpen={showSupplyXLMModal}
        onClose={closeSupplyXLMModal}
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
