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
      'bg-[#0A1628] border border-[#1E3A5F]',
      'shadow-[0_0_15px_0px_rgba(30,58,95,0.3)]',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#40E0D0]" />
            <h2 className="text-lg font-medium text-white">{t('lenderDashboard.recentActivity.title')}</h2>
          </div>
          <Button variant="outline" className="text-sm">
            {t('lenderDashboard.recentActivity.viewAll')}
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#1E3A5F]">
                <th className="pb-3 text-[#40E0D0] font-medium">{t('lenderDashboard.recentActivity.table.date')}</th>
                <th className="pb-3 text-[#40E0D0] font-medium">{t('lenderDashboard.recentActivity.table.type')}</th>
                <th className="pb-3 text-[#40E0D0] font-medium w-[200px]">{t('lenderDashboard.recentActivity.table.amount')}</th>
                <th className="pb-3 text-[#40E0D0] font-medium">{t('lenderDashboard.recentActivity.table.status')}</th>
                <th className="pb-3 text-[#40E0D0] font-medium w-[180px]"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-b border-[#1E3A5F] last:border-0">
                  <td className="py-4">{activity.date}</td>
                  <td className="py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs',
                      activity.type === 'investment' 
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-green-500/10 text-green-500'
                    )}>
                      {t(`lenderDashboard.recentActivity.types.${activity.type}`)}
                    </span>
                  </td>
                  <td className="py-4 text-green-500 w-[200px]">${activity.amount}</td>
                  <td className="py-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs',
                      activity.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-blue-500/10 text-blue-500'
                    )}>
                      {t(`lenderDashboard.recentActivity.status.${activity.status}`)}
                    </span>
                  </td>
                  <td className="py-4 text-center w-[180px]">
                    <Button variant="ghost" size="sm" className="group-hover:text-[#00FFFF]">
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