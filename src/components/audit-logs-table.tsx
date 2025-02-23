import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AuditLog {
  id: string
  action: string
  user: string
  timestamp: string
  details?: string
}

interface AuditLogsTableProps {
  logs: AuditLog[]
  isLoading: boolean
  error?: string
  onPageChange: (page: number) => void
  currentPage: number
  totalPages: number
}

export function AuditLogsTable({
  logs,
  isLoading,
  error,
  onPageChange,
  currentPage,
  totalPages,
}: AuditLogsTableProps) {
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[400px] items-center justify-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </motion.div>
    )
  }

  const getActionBadgeColor = (action: string) => {
    const colors = {
      'User Login': 'bg-blue-50 text-blue-700 ring-blue-600/10',
      'Loan Application': 'bg-purple-50 text-purple-700 ring-purple-600/10',
      'Payment Processed': 'bg-green-50 text-green-700 ring-green-600/10',
      'default': 'bg-gray-50 text-gray-700 ring-gray-600/10'
    }
    return colors[action as keyof typeof colors] || colors.default
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="w-[300px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset",
                        getActionBadgeColor(log.action)
                      )}
                    >
                      {log.action}
                    </motion.span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{log.user}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {log.details || '-'}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-2"
      >
        <p className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="transition-transform hover:scale-105"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="transition-transform hover:scale-105"
          >
            Next
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
} 