"use client";

import { useBorrow } from "../../hooks/useBorrow.hook";

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

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolData: PoolData | null;
  poolId?: string;
}

export function BorrowModal({ isOpen, onClose, poolId }: BorrowModalProps) {
  const {
    borrowAmount,
    loading,
    estimates,
    setBorrowAmount,
    handleBorrow,
    isHealthy,
    isAtRisk,
    isDangerous,
    isBorrowDisabled,
  } = useBorrow({ isOpen, onClose, poolId });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-dark-secondary p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-arrow-down text-warning text-xl"></i>
            <div>
              <h3 className="text-xl font-semibold text-white">Borrow USDC</h3>
              <p className="text-gray-400 text-sm">
                Borrow USDC against your collateral
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="form-label">Amount to Borrow</label>
              <span className="text-xs text-gray-400 bg-dark-tertiary px-2 py-1 rounded">
                USDC
              </span>
            </div>
            <input
              type="number"
              className="form-input text-lg h-12"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={loading}
            />
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-2">
              {[100, 500, 1000, 2500].map((amount) => (
                <button
                  key={amount}
                  className="btn-secondary text-xs flex-1"
                  onClick={() => setBorrowAmount(amount.toString())}
                  disabled={loading}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {borrowAmount && Number(borrowAmount) > 0 && (
            <div className="border-t border-custom pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <i className="fas fa-arrow-right"></i>
                Borrow Overview
              </h4>

              {/* Health Factor Card */}
              <div className="card p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Health Factor</span>
                  <div className="flex items-center gap-1">
                    {isHealthy ? (
                      <i className="fas fa-check-circle text-success"></i>
                    ) : (
                      <i
                        className={`fas fa-exclamation-triangle ${isAtRisk ? "text-warning" : "text-danger"}`}
                      ></i>
                    )}
                  </div>
                </div>
                <div
                  className={`text-xl font-bold ${
                    isHealthy
                      ? "text-success"
                      : isAtRisk
                        ? "text-warning"
                        : "text-danger"
                  }`}
                >
                  {estimates.healthFactor > 0
                    ? estimates.healthFactor.toFixed(2)
                    : "--"}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-dark-tertiary rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isHealthy
                          ? "bg-success"
                          : isAtRisk
                            ? "bg-warning"
                            : "bg-danger"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, (estimates.healthFactor / 3) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isHealthy
                      ? "Healthy position"
                      : isAtRisk
                        ? "At risk"
                        : "Liquidation risk"}
                  </p>
                </div>
              </div>

              {/* Borrow Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="card p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-percentage text-warning text-xs"></i>
                    <span className="text-xs text-gray-400">Borrow APY</span>
                  </div>
                  <div className="text-sm font-semibold text-warning">
                    {estimates.borrowAPY}%
                  </div>
                </div>
                <div className="card p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-shield text-gray-400 text-xs"></i>
                    <span className="text-xs text-gray-400">
                      Liquidation Threshold
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {estimates.liquidationThreshold}%
                  </div>
                </div>
              </div>

              {/* Required Collateral */}
              <div className="card p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                    <span className="text-xs text-gray-400">
                      Required Collateral
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    $
                    {estimates.requiredCollateral > 0
                      ? estimates.requiredCollateral.toLocaleString()
                      : "--"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Factor Warning */}
          {estimates.healthFactor > 0 && (
            <div
              className={`p-3 rounded border-l-4 ${
                isHealthy
                  ? "bg-green-900 bg-opacity-20 border-success text-success"
                  : isAtRisk
                    ? "bg-yellow-900 bg-opacity-20 border-warning text-warning"
                    : "bg-red-900 bg-opacity-20 border-danger text-danger"
              }`}
            >
              <div className="flex items-start gap-2">
                {isHealthy ? (
                  <i className="fas fa-check-circle mt-0.5"></i>
                ) : (
                  <i className="fas fa-exclamation-triangle mt-0.5"></i>
                )}
                <div className="text-sm">
                  {isHealthy && (
                    <>
                      <strong>Healthy Position:</strong> You have sufficient
                      collateral buffer for this borrow amount.
                    </>
                  )}
                  {isAtRisk && (
                    <>
                      <strong>Position At Risk:</strong> Consider reducing
                      borrow amount or adding more collateral.
                    </>
                  )}
                  {isDangerous && (
                    <>
                      <strong>Dangerous Position:</strong> This could lead to
                      immediate liquidation!
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Risk Disclaimer */}
          <div className="p-3 rounded bg-blue-900 bg-opacity-20 border border-blue-700 text-blue-300">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle mt-0.5 text-blue-400"></i>
              <div className="text-sm">
                <strong>Risk Disclaimer:</strong> Borrowing involves liquidation
                risk. Monitor your health factor regularly and maintain adequate
                collateral ratios to avoid liquidation.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleBorrow}
              disabled={isBorrowDisabled}
            >
              {loading ? (
                <>
                  <div className="loader mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-down mr-2"></i>
                  Borrow USDC
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
