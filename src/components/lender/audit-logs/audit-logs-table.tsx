import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, AlertCircle, Filter, Search, PlusCircle, FileEdit, Wallet, UserCog, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AuditLog, ACTION_CONFIGS, AuditAction } from "@/@types/audits.entity"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { TFunction } from "i18next"

interface AuditLogsTableProps {
  logs: AuditLog[]
  isLoading: boolean
  error?: string
  onPageChange: (page: number) => void
  currentPage: number
  totalPages: number
  onSearch: (term: string) => void
  onFilter: (action: AuditAction | 'ALL') => void
}

const getEventStyles = (action: AuditAction, t: TFunction) => {
  switch (action) {
    case 'LOAN_CREATE':
      return {
        color: 'text-amber-500 dark:text-amber-400',
        background: 'bg-amber-50 dark:bg-amber-900/10',
        icon: PlusCircle,
        label: t('auditLogs.filters.loanCreation')
      }
    case 'LOAN_UPDATE':
      return {
        color: 'text-blue-500 dark:text-blue-400',
        background: 'bg-blue-50 dark:bg-blue-900/10',
        icon: FileEdit,
        label: t('auditLogs.filters.loanUpdate')
      }
    case 'PAYMENT_PROCESS':
      return {
        color: 'text-emerald-500 dark:text-emerald-400',
        background: 'bg-emerald-50 dark:bg-emerald-900/10',
        icon: Wallet,
        label: t('auditLogs.filters.paymentProcess')
      }
    case 'USER_UPDATE':
      return {
        color: 'text-violet-500 dark:text-violet-400',
        background: 'bg-violet-50 dark:bg-violet-900/10',
        icon: UserCog,
        label: t('auditLogs.filters.userUpdate')
      }
    case 'RISK_ALERT':
      return {
        color: 'text-red-500 dark:text-red-400',
        background: 'bg-red-50 dark:bg-red-900/10',
        icon: AlertTriangle,
        label: t('auditLogs.filters.riskAlert')
      }
    default:
      return {
        color: 'text-gray-500 dark:text-gray-400',
        background: 'bg-gray-50 dark:bg-gray-900/10',
        icon: AlertCircle,
        label: t('auditLogs.filters.unknownAction')
      }
  }
}

export function AuditLogsTable({
  logs,
  isLoading,
  error,
  onPageChange,
  currentPage,
  totalPages,
  onSearch,
  onFilter,
}: AuditLogsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }, [onSearch])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-8"
      >
        <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 " />
        <p className="ml-3 text-red-600 dark:text-red-400">{error}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 theme-transition"
    >
      <div className="flex items-center justify-between">
        <p className="mt-2 text-muted-foreground  dark:text-gray-400">
          {t('auditLogs.subtitle')}
        </p>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute dark:bg-darkbg left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('auditLogs.filters.search')}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 dark:bg-darkbg dark:border-gray-800 dark:text-gray-400"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="dark:bg-darkbg dark:border-gray-800">
                <Filter className="mr-2 h-4 w-4 dark:text-gray-400" />
                <span className="dark:text-gray-400">{t('auditLogs.filters.filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-darkbg dark:border-gray-800">
              <DropdownMenuItem onClick={() => onFilter('ALL')} className="">
                {t('auditLogs.filters.allEvents')}
              </DropdownMenuItem>
              {Object.entries(ACTION_CONFIGS).map(([action, config]) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => onFilter(action as AuditAction)}
                  className=""
                >
                  <config.icon className="mr-2 h-4 w-4" />
                  {t(config.label)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {
        logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 !mt-[7.5rem]">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {t('auditLogs.empty.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('auditLogs.empty.description')}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border dark:border-gray-800 bg-card dark:bg-gray-900/50 overflow-hidden theme-transition">
            <Table>
              <TableHeader>
                <TableRow className="dark:bg-darkbg transition-colors duration-300">
                  <TableHead className="dark:text-gray-400 transition-colors duration-300">{t('auditLogs.table.event')}</TableHead>
                  <TableHead className="dark:text-gray-400 transition-colors duration-300">{t('auditLogs.table.description')}</TableHead>
                  <TableHead className="dark:text-gray-400 transition-colors duration-300">{t('auditLogs.table.user')}</TableHead>
                  <TableHead className="dark:text-gray-400 transition-colors duration-300">{t('auditLogs.table.timestamp')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence mode="wait">
                    {logs.map((log, index) => {
                      const eventStyle = getEventStyles(log.action, t)
                      return (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="dark:bg-darkbg"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-2 py-1",
                                  "transition-all duration-300 ease-in-out",
                                  eventStyle.background,
                                  eventStyle.color,
                                )}
                              >
                                <eventStyle.icon className={cn("h-4 w-4 transition-colors duration-300", eventStyle.color)} />
                                <span className="text-sm font-medium transition-colors duration-300">{eventStyle.label}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm dark:text-gray-300">{log.details}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium dark:text-gray-300">
                              {log.user?.email}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground dark:text-gray-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        )

      }

      {
        logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between px-2"
          >
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {t('auditLogs.pagination.showing', { page: currentPage, totalPages })}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="transition-transform hover:scale-105 dark:bg-darkbg dark:border-gray-800"
              >
                <span className="dark:text-gray-400">{t('auditLogs.pagination.previous')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="transition-transform hover:scale-105 dark:bg-darkbg dark:border-gray-800"
              >
                <span className="dark:text-gray-400">{t('auditLogs.pagination.next')}</span>
              </Button>
            </div>
          </motion.div>
        )
      }
    </motion.div>
  )
} 