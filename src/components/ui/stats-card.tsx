'use client'

import { cn } from '@/lib/utils'
import { Card } from './card'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  href: string
  color: {
    text: string
    border: string
    shadow: string
    line: string
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  href,
  color,
  className
}: StatsCardProps) {
  const { t } = useTranslation()
  // Función para determinar el patrón basado en el título
  const getPattern = () => {
    if (title === 'Repayments') {
      return {
        className: "absolute top-0 right-0 w-32 h-32 opacity-15",
        style: {
          background: `repeating-linear-gradient(
            45deg,
            ${color.shadow} 0px,
            ${color.shadow} 1px,
            transparent 1px,
            transparent 8px
          )`
        }
      }
    }
    if (title === 'System Audit Logs') {
      return {
        className: "absolute top-0 right-0 w-32 h-32 opacity-20",
        style: {
          background: `
            radial-gradient(circle at 50% 0%, ${color.shadow} 25%, transparent 25%) 0 0 / 8px 8px,
            radial-gradient(circle at 0% 50%, ${color.shadow} 25%, transparent 25%) 0 0 / 8px 8px,
            radial-gradient(circle at 100% 50%, ${color.shadow} 25%, transparent 25%) 0 0 / 8px 8px
          `
        }
      }
    }
    // Patrón de puntos por defecto
    return {
      className: "absolute top-0 right-0 w-32 h-32 opacity-20",
      style: {
        background: `
          radial-gradient(circle, rgba(0, 149, 255, 0.7) 1.5px, transparent 1.5px) 0 0 / 12px 12px
        `,
        filter: 'drop-shadow(0 0 1px rgba(0, 149, 255, 0.5))'
      }
    }
  }

  const pattern = getPattern()

  return (
    <Link href={href}>
      <Card
        className={cn(
          'group relative overflow-visible transition-all duration-300',
          'bg-[#0A1628] border border-[#1E3A5F]',
          'shadow-[0_0_15px_0px_rgba(30,58,95,0.3)]',
          className
        )}
      >
        {/* Background pattern */}
        <div 
          className={pattern.className}
          style={pattern.style}
        />
        {/* Hover glow effect - internal */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-15 transition-all duration-300"
          style={{
            backgroundColor: color.shadow,
          }}
        />
        {/* Hover glow effect - external */}
        <div
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 15px 2px ${color.shadow}`
          }}
        />
        <div className="p-6 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <div className="relative">
              <span 
                className={cn(
                  'relative flex items-center justify-center w-8 h-8 rounded-full z-10',
                  color.text
                )}
                style={{
                  backgroundColor: color.text === 'text-blue-400' ? 'rgba(59, 130, 246, 0.07)' :  
                    color.text === 'text-yellow-400' ? 'rgba(234, 179, 8, 0.07)' :
                    color.text === 'text-pink-300' ? 'rgba(228, 161, 221, 0.07)' :
                    'rgba(6, 182, 212, 0.07)'
                }}
              >
                {icon}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className={cn('text-2xl font-bold', color.text)}>{value}</p>
            <p className="mt-1 text-[13px] text-gray-400">{description}</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1 group-hover:text-[#00FFFF] transition-colors duration-300">
                {t('lenderDashboard.stats.viewDetails')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="relative h-[2px] w-full bg-[#1E3A5F] overflow-hidden">
              <div
                className="absolute left-0 h-full w-0 group-hover:w-1/4 transition-all duration-300"
                style={{
                  backgroundColor: color.line,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
} 