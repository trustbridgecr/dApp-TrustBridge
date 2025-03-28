'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface StatusBadgeProps {
  status: 'active' | 'inactive'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full',
        'dark:bg-[#0A1628] dark:border-[#2a2a2a] bg-white border-gray-200',
        'dark:shadow-[0_0_10px_rgba(64,224,208,0.2)] shadow-[0_0_10px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      <span className={cn(
        'relative flex h-2 w-2',
        status === 'active' ? 'text-green-500' : 'text-red-500'
      )}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      <span className="text-sm font-medium dark:text-white text-gray-900">
        {t('lenderDashboard.activeStatus')}
      </span>
    </div>
  )
} 