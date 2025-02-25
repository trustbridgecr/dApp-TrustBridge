import { PlusCircle, FileEdit, Wallet, UserCog, AlertTriangle, LucideIcon } from "lucide-react"

export interface AuditLog {
  id: string
  userId: string | null
  action: AuditAction
  timestamp: Date
  details: string | null
  user?: {
    id: string
    email: string
  }
}

export type AuditAction = 
  | 'LOAN_CREATE'
  | 'LOAN_UPDATE'
  | 'PAYMENT_PROCESS'
  | 'USER_UPDATE'
  | 'RISK_ALERT'

export interface ActionConfig {
  color: string
  background: string
  darkBackground: string
  icon: LucideIcon
  label: string
}

export const ACTION_CONFIGS: Record<AuditAction, ActionConfig> = {
  LOAN_CREATE: {
    color: 'text-amber-500 dark:text-amber-400',
    background: 'bg-amber-50',
    darkBackground: 'dark:bg-amber-400/10',
    icon: PlusCircle,
    label: 'auditLogs.filters.loanCreation'
  },
  LOAN_UPDATE: {
    color: 'text-blue-500 dark:text-blue-400',
    background: 'bg-blue-50',
    darkBackground: 'dark:bg-blue-400/10',
    icon: FileEdit,
    label: 'auditLogs.filters.loanUpdate'
  },
  PAYMENT_PROCESS: {
    color: 'text-emerald-500 dark:text-emerald-400',
    background: 'bg-emerald-50',
    darkBackground: 'dark:bg-emerald-400/10',
    icon: Wallet,
    label: 'auditLogs.filters.paymentProcess'
  },
  USER_UPDATE: {
    color: 'text-violet-500 dark:text-violet-400',
    background: 'bg-violet-50',
    darkBackground: 'dark:bg-violet-400/10',
    icon: UserCog,
    label: 'auditLogs.filters.userUpdate'
  },
  RISK_ALERT: {
    color: 'text-red-500 dark:text-red-400',
    background: 'bg-red-50',
    darkBackground: 'dark:bg-red-400/10',
    icon: AlertTriangle,
    label: 'auditLogs.filters.riskAlert'
  }
}

export interface AuditLogsResponse {
  logs: AuditLog[]
  currentPage: number
  totalPages: number
  totalItems: number
}