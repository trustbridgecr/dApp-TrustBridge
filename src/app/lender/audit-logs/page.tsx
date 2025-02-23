'use client'

import { useEffect, useState } from 'react'
import { AuditLogsTable } from '@/components/audit-logs-table'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchLogs(page: number) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/audit/logs?page=${page}`)
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      const data = await response.json()
      setLogs(data.logs)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load audit logs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(currentPage)
  }, [currentPage])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Audit Logs</h1>
        <p className="mt-2 text-muted-foreground">
          Track and monitor all system activities and changes
        </p>
      </div>
      
      <AuditLogsTable
        logs={logs}
        isLoading={isLoading}
        error={error}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
} 