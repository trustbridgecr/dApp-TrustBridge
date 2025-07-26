// frontend/src/app/dashboard/marketplace/borrower/layout.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingDown, Shield, DollarSign } from 'lucide-react';

interface BorrowerLayoutProps {
  children: React.ReactNode;
}

export default function BorrowerLayout({ children }: BorrowerLayoutProps) {
  const router = useRouter();

  const handleBackToMarketplace = () => {
    try {
      localStorage.removeItem('userRole');
    } catch (error) {
      console.warn('Failed to remove userRole from localStorage:', error);
    }
    router.push('/dashboard/marketplace');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Borrower Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToMarketplace}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Marketplace</span>
              </button>
              
              <div className="h-6 w-px bg-gray-600"></div>
              
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-6 h-6 text-red-400" />
                <span className="text-xl font-semibold text-white">
                  Borrower Mode
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400">Available to Borrow:</span>
                  <span className="text-white font-medium">$0.00</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">Health Factor:</span>
                  <span className="text-green-400 font-medium">∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}