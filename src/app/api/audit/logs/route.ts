import { NextResponse } from "next/server"
import { AuditAction } from '@/@types/audits.entity'

const allMockLogs = [
    {
      id: '1',
      userId: 'user-1',
      action: 'LOAN_CREATE' as AuditAction,
      timestamp: new Date(Date.now() - 1000),
      details: 'New loan request #LA-2024-001 created',
      user: {
        id: 'user-1',
        email: 'john.doe@example.com'
      }
    },
    {
      id: '2',
      userId: 'user-2',
      action: 'LOAN_UPDATE' as AuditAction,
      timestamp: new Date(Date.now() - 3600000),
      details: 'Loan #LA-2024-001 terms updated',
      user: {
        id: 'user-2',
        email: 'jane.smith@example.com'
      }
    },
    {
      id: '3',
      userId: 'user-3',
      action: 'PAYMENT_PROCESS' as AuditAction,
      timestamp: new Date(Date.now() - 7200000),
      details: 'Payment of $500.00 processed for loan #LA-2024-001',
      user: {
        id: 'user-3',
        email: 'robert.wilson@example.com'
      }
    },
    {
      id: '4',
      userId: 'user-4',
      action: 'USER_UPDATE' as AuditAction,
      timestamp: new Date(Date.now() - 10800000),
      details: 'User profile information updated',
      user: {
        id: 'user-4',
        email: 'sarah.parker@example.com'
      }
    },
    {
      id: '5',
      userId: 'user-5',
      action: 'RISK_ALERT' as AuditAction,
      timestamp: new Date(Date.now() - 14400000),
      details: 'High risk alert: Multiple failed payment attempts',
      user: {
        id: 'user-5',
        email: 'michael.brown@example.com'
      }
    },
    {
      id: '6',
      userId: 'user-1',
      action: 'LOAN_CREATE' as AuditAction,
      timestamp: new Date(Date.now() - 18000000),
      details: 'New loan request #LA-2024-002 created',
      user: {
        id: 'user-1',
        email: 'john.doe@example.com'
      }
    },
    {
      id: '7',
      userId: 'user-2',
      action: 'PAYMENT_PROCESS' as AuditAction,
      timestamp: new Date(Date.now() - 21600000),
      details: 'Payment of $750.00 processed for loan #LA-2024-002',
      user: {
        id: 'user-2',
        email: 'jane.smith@example.com'
      }
    },
    {
      id: '8',
      userId: 'user-3',
      action: 'USER_UPDATE' as AuditAction,
      timestamp: new Date(Date.now() - 25200000),
      details: 'Password reset completed',
      user: {
        id: 'user-3',
        email: 'robert.wilson@example.com'
      }
    },
    {
      id: '9',
      userId: 'user-4',
      action: 'RISK_ALERT' as AuditAction,
      timestamp: new Date(Date.now() - 28800000),
      details: 'Suspicious activity detected on loan #LA-2024-002',
      user: {
        id: 'user-4',
        email: 'sarah.parker@example.com'
      }
    },
    {
      id: '10',
      userId: 'user-5',
      action: 'LOAN_UPDATE' as AuditAction,
      timestamp: new Date(Date.now() - 32400000),
      details: 'Loan #LA-2024-002 status changed to approved',
      user: {
        id: 'user-5',
        email: 'michael.brown@example.com'
      }
    },
    {
      id: '11',
      userId: 'user-1',
      action: 'LOAN_CREATE' as AuditAction,
      timestamp: new Date(Date.now() - 36000000),
      details: 'New loan request #LA-2024-003 created',
      user: {
        id: 'user-1',
        email: 'john.doe@example.com'
      }
    },
    {
      id: '12',
      userId: 'user-2',
      action: 'PAYMENT_PROCESS' as AuditAction,
      timestamp: new Date(Date.now() - 39600000),
      details: 'Payment of $1000.00 processed for loan #LA-2024-003',
      user: {
        id: 'user-2',
        email: 'jane.smith@example.com'
      }
    },
    {
      id: '13',
      userId: 'user-3',
      action: 'USER_UPDATE' as AuditAction,
      timestamp: new Date(Date.now() - 43200000),
      details: 'User profile information updated',
      user: {
        id: 'user-3',
        email: 'robert.wilson@example.com'
      }
    },      
  ]

  const translateAction = (action: AuditAction) => {
    switch (action) {
      case 'LOAN_CREATE':
        return 'Loan Created'
      case 'LOAN_UPDATE':
        return 'Loan Updated'
      case 'PAYMENT_PROCESS':
        return 'Payment Processed'
      case 'USER_UPDATE':
        return 'User Updated'
      case 'RISK_ALERT':
        return 'Risk Alert'
      default:
        return action
    }
  }
  
  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const search = searchParams.get('search') || ''
      const action = searchParams.get('action') as AuditAction | 'ALL' | null
      const limit = 5
  
      let filteredLogs = [...allMockLogs]
  
      if (search) {
        const searchLower = search.toLowerCase()
        filteredLogs = filteredLogs.filter(log => 
          /* translateAction(log.action).toLowerCase().includes(searchLower) || */
          log.details.toLowerCase().includes(searchLower) ||
          log.user.email.toLowerCase().includes(searchLower)
        )
      }
  
      if (action && action !== 'ALL') {
        filteredLogs = filteredLogs.filter(log => log.action === action)
      }
  
      const start = (page - 1) * limit
      const end = start + limit
  
      const paginatedLogs = filteredLogs.slice(start, end)
  
      const totalPages = Math.ceil(filteredLogs.length / limit)
  
      return NextResponse.json({
        logs: paginatedLogs,
        currentPage: page,
        totalPages,
        totalItems: filteredLogs.length
      })
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  } 