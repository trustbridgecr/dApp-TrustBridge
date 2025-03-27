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
        'bg-[#0A1628] border border-[#2a2a2a]',
        'shadow-[0_0_10px_rgba(64,224,208,0.2)]',
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
      <span className="text-sm font-medium">
        {t('lenderDashboard.activeStatus')}
      </span>
    </div>
  )
} 