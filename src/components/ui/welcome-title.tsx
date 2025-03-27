'use client'

import { cn } from '@/lib/utils'

interface WelcomeTitleProps {
  title: string
  className?: string
}

export function WelcomeTitle({ title, className }: WelcomeTitleProps) {
  return (
    <div className={cn('relative', className)}>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#00A8A8] bg-clip-text text-transparent">
        {title}
      </h1>
      {/* Primera línea decorativa - 75% del ancho */}
      <div className="absolute -bottom-2 left-0 w-3/4 h-[3px] bg-[#00FFFF] opacity-50" />
      {/* Segunda línea decorativa - 50% del ancho */}
      <div className="absolute -bottom-3 left-0 w-1/2 h-[2px] bg-[#00FFFF] opacity-30" />
    </div>
  )
} 