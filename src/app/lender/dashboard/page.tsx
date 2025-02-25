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
import { useState, useEffect } from 'react';

export default function LenderDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Mock data for recent activity
  const recentActivity = [
    {
      date: '2024-03-15',
      type: 'Investment',
      amount: 1000,
      status: 'Completed'
    },
    {
      date: '2024-03-10',
      type: 'Return',
      amount: 250,
      status: 'Received'
    }
  ];

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('lender.dashboard.welcome', 'Welcome')}, {user?.name}!
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white dark:bg-[#18181B] dark:border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {t('lender.dashboard.activeLoans', 'Active Loans')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">0</p>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] dark:border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {t('lender.dashboard.totalInvested', 'Total Invested')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">$0.00</p>
                <p className="text-sm text-muted-foreground">
                  {t('lender.dashboard.acrossLoans', 'Across 0 loans')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] dark:border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {t('lender.dashboard.expectedReturns', 'Expected Returns')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">$0.00</p>
                <p className="text-sm text-muted-foreground">
                  {t('lender.dashboard.avgReturn', 'Average return: 0%')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white dark:bg-[#18181B] dark:border-none shadow-none">
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
    </main>
  );
} 