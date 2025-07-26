
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'lender' | 'borrower' | null>(null);

  const handleRoleSelection = (role: 'lender' | 'borrower') => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;

    localStorage.setItem('userRole', selectedRole);

   
    if (selectedRole === 'borrower') {
      router.push('/dashboard/marketplace/borrower');
    } else {
      router.push('/dashboard/marketplace/lender');
    }

    onClose();
    setSelectedRole(null);
  };

  const handleCancel = () => {
    setSelectedRole(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>
            <p className="text-gray-400 text-sm">
              Select how you want to interact with TrustBridge
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
         
          <div
            onClick={() => handleRoleSelection('lender')}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
              selectedRole === 'lender'
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedRole === 'lender' ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  I &apos; m a Lender
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Supply assets to earn interest and provide liquidity to the market
                </p>
                <div className="flex items-center space-x-2 text-xs text-green-400">
                  <Info className="w-3 h-3" />
                  <span>Earn up to 15% APY on your assets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Option */}
          <div
            onClick={() => handleRoleSelection('borrower')}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
              selectedRole === 'borrower'
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedRole === 'borrower' ? 'bg-red-500' : 'bg-gray-700'
              }`}>
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  I &apos; m a Borrower
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Borrow assets by providing collateral for your financial needs
                </p>
                <div className="flex items-center space-x-2 text-xs text-red-400">
                  <Info className="w-3 h-3" />
                  <span>Borrow starting from 6.8% APY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              selectedRole
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}