// frontend/src/app/dashboard/marketplace/lender/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LenderMarketplacePage from '@/components/modules/marketplace/ui/pages/LenderMarketPlacePage';
import { useWalletContext } from '@/providers/wallet.provider';

export default function LenderPage() {
  const router = useRouter();
  const { walletAddress} = useWalletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'lender') {
      router.push('/dashboard/marketplace');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Lender Dashboard
          </h1>
          <p className="text-gray-300">
            Supply assets and earn interest on your deposits
          </p>
        </div>
        
        <LenderMarketplacePage />
      </div>
    </div>
  );
}