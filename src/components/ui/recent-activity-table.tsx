'use client'

import { cn } from '@/lib/utils'
import { Activity, ChevronRight } from 'lucide-react'
import { Button } from "./button"
import { Card } from "./card"
import { useTranslation } from 'react-i18next'

interface ActivityItem {
  date: string
  type: 'investment' | 'return'
  amount: string
  status: 'completed' | 'received'
}

interface RecentActivityTableProps {
  activities: ActivityItem[]
  className?: string
}

export function RecentActivityTable({ activities, className }: RecentActivityTableProps) {
  const { t } = useTranslation()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'received':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'investment':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'return':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card className={cn(
      'dark:bg-[#0A1628] dark:border-[#1E3A5F] bg-white border-gray-200',
      'dark:shadow-[0_0_15px_0px_rgba(30,58,95,0.3)] shadow-[0_0_15px_0px_rgba(0,0,0,0.1)]',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 dark:text-[#40E0D0] text-cyan-500" />
            <h2 className="text-lg font-medium dark:text-white text-gray-900">{t('lenderDashboard.recentActivity.title')}</h2>
          </div>
          <Button variant="outline" className="text-sm dark:text-gray-400 text-gray-600">
            {t('lenderDashboard.recentActivity.viewAll')}
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b dark:border-[#1E3A5F] border-gray-200">
                <th className="pb-3 dark:text-[#40E0D0] text-cyan-600 font-medium">{t('lenderDashboard.recentActivity.table.date')}</th>
                <th className="pb-3 dark:text-[#40E0D0] text-cyan-600 font-medium">{t('lenderDashboard.recentActivity.table.type')}</th>
                <th className="pb-3 dark:text-[#40E0D0] text-cyan-600 font-medium w-[200px]">{t('lenderDashboard.recentActivity.table.amount')}</th>
                <th className="pb-3 dark:text-[#40E0D0] text-cyan-600 font-medium">{t('lenderDashboard.recentActivity.table.status')}</th>
                <th className="pb-3 dark:text-[#40E0D0] text-cyan-600 font-medium w-[180px]"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-b dark:border-[#1E3A5F] border-gray-200 last:border-0">
                  <td className="py-4 dark:text-gray-400 text-gray-600">{activity.date}</td>
                  <td className="py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs',
                      activity.type === 'investment' 
                        ? 'dark:bg-blue-500/10 bg-blue-50 dark:text-blue-400 text-blue-600'
                        : 'dark:bg-green-500/10 bg-green-50 dark:text-green-400 text-green-600'
                    )}>
                      {t(`lenderDashboard.recentActivity.types.${activity.type}`)}
                    </span>
                  </td>
                  <td className="py-4 dark:text-green-400 text-green-600 w-[200px]">{activity.amount}</td>
                  <td className="py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs',
                      activity.status === 'completed'
                        ? 'dark:bg-green-500/10 bg-green-50 dark:text-green-400 text-green-600'
                        : 'dark:bg-blue-500/10 bg-blue-50 dark:text-blue-400 text-blue-600'
                    )}>
                      {t(`lenderDashboard.recentActivity.status.${activity.status}`)}
                    </span>
                  </td>
                  <td className="py-4 text-center w-[180px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group-hover:text-[#00FFFF] dark:hover:bg-[#1E3A5F] hover:bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
} 