'use client'

import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF]" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
      </div>
    </div>
  )
} 