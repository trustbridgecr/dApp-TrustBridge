'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { WelcomeTitle } from '@/components/ui/welcome-title';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatsCard } from '@/components/ui/stats-card';
import { RecentActivityTable } from '@/components/ui/recent-activity-table';
import { CreditCard, FileText, History, Receipt } from 'lucide-react';

interface ActivityItem {
  date: string;
  type: 'investment' | 'return';
  amount: string;
  status: 'completed' | 'received';
}

export const LenderDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const recentActivity: ActivityItem[] = [
    { date: '2024-03-15', type: 'investment', amount: '$1000', status: 'completed' },
    { date: '2024-03-10', type: 'return', amount: '$250', status: 'received' }
  ];

  const stats = [
    {
      title: t('lenderDashboard.stats.activeLoans.title'),
      value: t('lenderDashboard.stats.activeLoans.value', { count: 10 }),
      description: t('lenderDashboard.stats.activeLoans.description'),
      icon: <CreditCard className="w-4 h-4" />,
      href: '/admin/lender/loans',
      color: {
        text: 'text-blue-400',
        border: 'border-blue-400',
        shadow: 'rgba(96, 165, 250, 0.3)',
        line: 'rgba(96, 165, 250)'
      }
    },
    {
      title: t('lenderDashboard.stats.loanRequests.title'),
      value: t('lenderDashboard.stats.loanRequests.value', { count: 5 }),
      description: t('lenderDashboard.stats.loanRequests.description'),
      icon: <FileText className="w-4 h-4" />,
      href: '/admin/lender/requests',
      color: {
        text: 'text-yellow-400',
        border: 'border-yellow-400',
        shadow: 'rgba(250, 204, 21, 0.3)',
        line: 'rgba(250, 204, 21)'
      }
    },
    {
      title: t('lenderDashboard.stats.repayments.title'),
      value: t('lenderDashboard.stats.repayments.value', { count: 7 }),
      description: t('lenderDashboard.stats.repayments.description'),
      icon: <Receipt className="w-4 h-4" />,
      href: '/admin/lender/repayments',
      color: {
        text: 'text-pink-300',
        border: 'border-pink-300',
        shadow: 'rgba(228, 161, 221, 0.3)',
        line: 'rgba(228, 161, 221)'
      }
    },
    {
      title: t('lenderDashboard.stats.systemAuditLogs.title'),
      value: t('lenderDashboard.stats.systemAuditLogs.value', { count: 8 }),
      description: t('lenderDashboard.stats.systemAuditLogs.description'),
      icon: <History className="w-4 h-4" />,
      href: '/admin/lender/audit-logs',
      color: {
        text: 'text-cyan-400',
        border: 'border-cyan-400',
        shadow: 'rgba(34, 211, 238, 0.3)',
        line: 'rgba(34, 211, 238)'
      }
    }
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <WelcomeTitle title={t('lenderDashboard.welcome', { name: user?.name || 'John Doe' })} />
        <StatusBadge status="active" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <RecentActivityTable activities={recentActivity} />
    </div>
  );
}
