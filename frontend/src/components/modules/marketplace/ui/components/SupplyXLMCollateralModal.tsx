"use client";

import { useSupplyCollateral } from "../../hooks/useSupplyCollateral.hook";

interface SupplyXLMCollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyXLMCollateralModal({
  isOpen,
  onClose,
  onSuccess,
}: SupplyXLMCollateralModalProps) {
  const {
    collateralAmount,
    loading,
    estimates,
    setCollateralAmount,
    handleSupplyCollateral,
    isHealthy,
    isAtRisk,
    showHealthWarning,
    isSupplyDisabled,
  } = useSupplyCollateral({ isOpen, onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-dark-secondary p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-shield text-blue-400 text-xl"></i>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Supply XLM Collateral
              </h3>
              <p className="text-gray-400 text-sm">
                Deposit XLM to unlock borrowing power
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
              <label className="form-label">Amount to Supply</label>
              <span className="text-xs text-gray-400 bg-dark-tertiary px-2 py-1 rounded">
                XLM
              </span>
            </div>
            <input
              type="number"
              className="form-input text-lg h-12"
              placeholder="0.00"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={loading}
            />
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-2">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  className="btn-secondary text-xs flex-1"
                  onClick={() => setCollateralAmount(amount.toString())}
                  disabled={loading}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {estimates.borrowingPower > 0 && (
            <div className="border-t border-custom pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <i className="fas fa-arrow-right"></i>
                Collateral Overview
              </h4>

              {/* Borrowing Power */}
              <div className="card p-4 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">You will unlock</span>
                  <span className="text-xs text-blue-400 bg-blue-900 bg-opacity-20 px-2 py-1 rounded">
                    75% LTV
                  </span>
                </div>
                <div className="text-xl font-bold text-blue-400">
                  ${estimates.borrowingPower}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Available borrowing power
                </p>
              </div>

              {/* Collateral Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="card p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                    <span className="text-xs text-gray-400">
                      Collateral Value
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    ${estimates.collateralValue}
                  </div>
                </div>
                <div className="card p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-arrow-down text-warning text-xs"></i>
                    <span className="text-xs text-gray-400">
                      Liquidation Price
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-warning">
                    ${estimates.liquidationPrice}
                  </div>
                </div>
              </div>

              {/* Health Factor */}
              <div className="card p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-shield text-gray-400 text-xs"></i>
                    <span className="text-xs text-gray-400">Health Factor</span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isHealthy
                        ? "text-success"
                        : isAtRisk
                          ? "text-warning"
                          : "text-danger"
                    }`}
                  >
                    {estimates.healthFactor}
                  </div>
                </div>
                <div className="w-full bg-dark-tertiary rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isHealthy
                        ? "bg-success"
                        : isAtRisk
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
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
          )}

          {/* Health Factor Warning */}
          {showHealthWarning && (
            <div className="p-3 rounded bg-yellow-900 bg-opacity-20 border border-yellow-700 text-warning">
              <div className="flex items-start gap-2">
                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                <div className="text-sm">
                  <strong>Risk Warning:</strong> Your health factor will be at
                  risk. Consider supplying more collateral.
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="p-3 rounded bg-blue-900 bg-opacity-20 border border-blue-700 text-blue-300">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle mt-0.5 text-blue-400"></i>
              <div className="text-sm">
                <strong>About XLM Collateral:</strong> XLM has a 75%
                loan-to-value ratio. Your health factor must stay above 1.0 to
                avoid liquidation.
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
              className="btn-secondary"
              onClick={handleSupplyCollateral}
              disabled={isSupplyDisabled}
            >
              {loading ? (
                <>
                  <div className="loader mr-2"></div>
                  Supplying...
                </>
              ) : (
                <>
                  <i className="fas fa-shield mr-2"></i>
                  Supply Collateral
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
