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
        color: 'text-amber-500',
        background: 'bg-amber-500/10',
        icon: PlusCircle,
        label: t('auditLogs.filters.loanCreation')
      }
    case 'LOAN_UPDATE':
      return {
        color: 'text-blue-500',
        background: 'bg-blue-500/10',
        icon: FileEdit,
        label: t('auditLogs.filters.loanUpdate')
      }
    case 'PAYMENT_PROCESS':
      return {
        color: 'text-emerald-500',
        background: 'bg-emerald-500/10',
        icon: Wallet,
        label: t('auditLogs.filters.paymentProcess')
      }
    case 'USER_UPDATE':
      return {
        color: 'text-violet-500',
        background: 'bg-violet-500/10',
        icon: UserCog,
        label: t('auditLogs.filters.userUpdate')
      }
    case 'RISK_ALERT':
      return {
        color: 'text-red-500',
        background: 'bg-red-500/10',
        icon: AlertTriangle,
        label: t('auditLogs.filters.riskAlert')
      }
    default:
      return {
        color: 'text-gray-500',
        background: 'bg-gray-500/10',
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
        className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8"
      >
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="ml-3 text-red-600">{error}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
            Audit Logs
          </h1>
          <div className="flex flex-col gap-[3px]">
            <div className="h-[3px] max-w-[160px] bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
            <div className="h-[2px] max-w-28 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="rounded-full w-fit ml-auto py-2 px-3 flex justify-center items-center gap-3 sm:px-4 dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] self-start md:self-auto hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.25)] transition-all duration-300">
          <div className="h-2 w-2 md:w-4 md:h-4 bg-[#63CDE6] rounded-full animate-pulse"></div>
          <span className="text-green-100 text-sm">System Activity</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300">
        {/* Table Header with Search and Filters */}
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 md:gap-0 md:justify-between md:items-center mb-6">
          <div className="w-full lg:w-1/2">
            <p className="text-sm md:text-base text-gray-400">
              Track all system activities and changes
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col md:flex-row md:justify-end gap-2 items-start md:items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 bg-gray-900/50 border-gray-700 text-gray-300 w-full md:w-[300px] h-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gray-900/50 border-gray-700 text-gray-300 h-10 px-4">
                    <Filter className="mr-2 h-4 w-4" />
                    All Events
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                  <DropdownMenuItem onClick={() => onFilter('ALL')}>
                    {t('auditLogs.filters.allEvents')}
                  </DropdownMenuItem>
                  {Object.entries(ACTION_CONFIGS).map(([action, config]) => (
                    <DropdownMenuItem
                      key={action}
                      onClick={() => onFilter(action as AuditAction)}
                    >
                      <config.icon className="mr-2 h-4 w-4" />
                      {t(config.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-300">
              {t('auditLogs.empty.title')}
            </p>
            <p className="text-sm text-gray-400">
              {t('auditLogs.empty.description')}
            </p>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-800">
                  <TableHead className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">Event</TableHead>
                  <TableHead className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">Description</TableHead>
                  <TableHead className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">User</TableHead>
                  <TableHead className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-[#63CDE6]" />
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
                          className="hover:bg-[#0A1420] transition-colors border-gray-800"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-3 py-1.5",
                                  eventStyle.background,
                                  eventStyle.color
                                )}
                              >
                                <eventStyle.icon className={cn("h-4 w-4", eventStyle.color)} />
                                <span className="text-sm font-medium">{eventStyle.label}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-300">{log.details}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-300">{log.user?.email}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-400">
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
        )}

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-[#0A1420]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-[#0A1420]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 