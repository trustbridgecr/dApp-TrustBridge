"use client";

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="w-full">
      <div className={cn("h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden", className)}>
        <div className="h-full bg-black rounded-full" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-sm text-muted-foreground text-right mt-2">{percentage.toFixed(1)}% paid</p>
    </div>
  )
}

