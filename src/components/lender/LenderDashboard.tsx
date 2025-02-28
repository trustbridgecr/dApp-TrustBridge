'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';

const DashboardCard = ({ title, value, subtext, color }: { title: string; value: string; subtext?: string; color: string }) => (
  <Card className="bg-white dark:bg-darkbg dark:border-gray-700 border-gray-200 shadow-none">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
      </div>
    </CardContent>
  </Card>
);

export default function LenderDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const recentActivity = [
    { date: '2024-03-15', type: 'Investment', amount: 1000, status: 'Completed' },
    { date: '2024-03-10', type: 'Return', amount: 250, status: 'Received' }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('lender.dashboard.welcome', 'Welcome')}, {user?.name}!
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard title={t('lender.dashboard.activeLoans', 'Active Loans')} value="0" color="text-primary" />
          <DashboardCard title={t('lender.dashboard.totalInvested', 'Total Invested')} value="$0.00" subtext={t('lender.dashboard.acrossLoans', 'Across 0 loans')} color="text-green-600 dark:text-green-400" />
          <DashboardCard title={t('lender.dashboard.expectedReturns', 'Expected Returns')} value="$0.00" subtext={t('lender.dashboard.avgReturn', 'Average return: 0%')} color="text-purple-600 dark:text-purple-400" />
        </div>

        <Card className="mt-6 bg-white dark:bg-darkbg dark:border-gray-700 border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle>{t('lender.dashboard.recentActivity', 'Recent Activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('lender.dashboard.date', 'Date')}</TableHead>
                    <TableHead>{t('lender.dashboard.type', 'Type')}</TableHead>
                    <TableHead>{t('lender.dashboard.amount', 'Amount')}</TableHead>
                    <TableHead>{t('lender.dashboard.status', 'Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={`${activity.date}-${activity.type}-${activity.amount}`}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>${activity.amount}</TableCell>
                      <TableCell>{activity.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                {t('lender.dashboard.noActivity', 'No recent activity to display')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
