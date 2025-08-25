"use client";

import { useSupply } from "../../hooks/useSupply.hook";

interface SupplyUSDCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupplyUSDCModal({
  isOpen,
  onClose,
  onSuccess,
}: SupplyUSDCModalProps) {
  const {
    supplyAmount,
    loading,
    estimates,
    setSupplyAmount,
    handleSupplyUSDC,
    isSupplyDisabled,
  } = useSupply({
    isOpen,
    onClose,
    onSuccess,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-dark-secondary p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <i className="fas fa-dollar-sign text-green-400 text-lg"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Supply USDC
              </h3>
              <p className="text-sm text-neutral-400">
                Earn yield by supplying USDC to the lending pool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="supply-amount" className="text-sm text-neutral-300">
              Amount to Supply
            </label>
            <span className="text-xs text-neutral-400 bg-neutral-700 px-2 py-1 rounded">
              USDC
            </span>
          </div>
          <div className="relative">
            <input
              id="supply-amount"
              type="number"
              placeholder="0.00"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-600 text-neutral-200 text-lg h-12 pr-16 px-4 rounded placeholder:text-neutral-500"
              min="0"
              step="0.01"
              disabled={loading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              USDC
            </span>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-3">
            {[25, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setSupplyAmount(amount.toString())}
                disabled={loading}
                className="flex-1 border border-neutral-600 text-neutral-400 text-xs py-2 rounded hover:bg-neutral-800 hover:text-white"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Preview */}
        {estimates.expectedBTokens > 0 && (
          <div className="mb-6">
            <div className="border-t border-neutral-700 pt-4 space-y-4">
              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <i className="fas fa-arrow-right"></i>
                Transaction Preview
              </h4>

              {/* You Will Receive */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-400">
                    You will receive
                  </span>
                  <span className="text-xs text-green-300 bg-green-900/30 border border-green-700 px-2 py-1 rounded">
                    bUSDC Tokens
                  </span>
                </div>
                <div className="text-xl font-bold text-green-400">
                  ~{estimates.expectedBTokens}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Receipt tokens representing your pool share
                </p>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-percentage text-green-400 text-xs"></i>
                    <span className="text-xs text-neutral-400">Supply APY</span>
                  </div>
                  <div className="text-sm font-semibold text-green-400">
                    {estimates.currentSupplyAPY}%
                  </div>
                </div>

                <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <i className="fas fa-shield-alt text-blue-400 text-xs"></i>
                    <span className="text-xs text-neutral-400">
                      Health Factor
                    </span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      estimates.newPositionHealth > 50
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {estimates.newPositionHealth}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Alert */}
        <div className="bg-blue-900/20 border border-blue-700/50 text-blue-300 text-sm rounded p-3 mb-6">
          <div className="flex items-start gap-2">
            <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
            <p>
              <strong>About bUSDC:</strong> These tokens automatically earn
              yield and represent your share of the pool. You can redeem them
              anytime for USDC plus accrued interest.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-neutral-600 text-neutral-300 py-2 rounded hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSupplyUSDC}
            disabled={isSupplyDisabled}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loader border-white border-t-transparent border-2 rounded-full w-4 h-4 animate-spin"></div>
                Supplying...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="fas fa-arrow-up"></i>
                Supply USDC
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
