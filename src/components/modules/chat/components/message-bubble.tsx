'use client'

import { cn } from '@/lib/utils'
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-[#00FFFF]" />
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'flex',
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] md:max-w-[60%] lg:max-w-[50%] rounded-lg p-3',
          message.sender === 'user'
            ? 'bg-[#00FFFF]/10 text-[#00FFFF]'
            : 'bg-gray-100 dark:bg-[#1E3A5F]/50 dark:text-white text-gray-900'
        )}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs opacity-50">{message.timestamp}</span>
          {message.sender === 'user' && getStatusIcon()}
        </div>
      </div>
    </div>
  )
} 