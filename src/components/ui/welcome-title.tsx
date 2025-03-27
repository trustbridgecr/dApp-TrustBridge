'use client'

import { cn } from '@/lib/utils'

interface WelcomeTitleProps {
  title: string
  className?: string
}

export function WelcomeTitle({ title, className }: WelcomeTitleProps) {
  return (
    <div className={cn('relative', className)}>
      <h1 className={cn(
        'text-4xl font-bold text-black',
        'dark:bg-gradient-to-r dark:from-[#00FFFF] dark:to-[#00A8A8] dark:bg-clip-text dark:text-transparent'
      )}>
        {title}
      </h1>
      {/* Primera línea decorativa - 75% del ancho */}
      <div className="absolute -bottom-2 left-0 w-3/4 h-[3px] bg-gradient-to-r from-[#00FFFF] to-[#00A8A8] opacity-50" />
      {/* Segunda línea decorativa - 50% del ancho */}
      <div className="absolute -bottom-3 left-0 w-1/2 h-[2px] bg-gradient-to-r from-[#00FFFF] to-[#00A8A8] opacity-30" />
    </div>
  )
} 