'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export default function LenderDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
        {t('lender.dashboard.welcome', 'Welcome Lender')}, {user?.name}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Loans Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            {t('lender.dashboard.activeLoans', 'Active Loans')}
          </h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
        </div>

        {/* Total Invested Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            {t('lender.dashboard.totalInvested', 'Total Invested')}
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$0.00</p>
        </div>

        {/* Expected Returns Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            {t('lender.dashboard.expectedReturns', 'Expected Returns')}
          </h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">$0.00</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
          {t('lender.dashboard.recentActivity', 'Recent Activity')}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {t('lender.dashboard.noActivity', 'No recent activity to display')}
          </p>
        </div>
      </div>
    </div>
  );
} 