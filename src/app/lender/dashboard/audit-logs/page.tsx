'use client'

import { useEffect, useState, useCallback } from 'react'
import { AuditLogsTable } from '@/components/lender/audit-logs/audit-logs-table'
import { AuditLog, AuditAction } from '@/@types/audits.entity'
import { useDebounce } from '@/hooks/use-debounce'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFilter, setCurrentFilter] = useState<AuditAction | 'ALL'>('ALL')
  
  const debouncedSearch = useDebounce(searchTerm, 300)

  const fetchLogs = useCallback(async (
    page: number,
    search?: string,
    filter?: AuditAction | 'ALL'
  ) => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(filter && filter !== 'ALL' && { action: filter })
      })
      
      const response = await fetch(`/api/audit/logs?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      const data = await response.json()
      setLogs(data.logs)
      setTotalPages(data.totalPages)
    } catch {
      setError('Failed to load audit logs')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs(currentPage, debouncedSearch, currentFilter)
  }, [currentPage, debouncedSearch, currentFilter, fetchLogs])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handleFilter = useCallback((action: AuditAction | 'ALL') => {
    setCurrentFilter(action)
    setCurrentPage(1)
  }, [])

  return (
    <div className="container mx-auto p-6">
      <AuditLogsTable
        logs={logs}
        isLoading={isLoading}
        error={error}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </div>
  )
} 