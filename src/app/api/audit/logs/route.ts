import { NextResponse } from 'next/server'

const allMockLogs = [
  {
    id: '1',
    action: 'User Login',
    user: 'john.doe@example.com',
    timestamp: new Date(Date.now() - 1000).toISOString(),
    details: 'Successful login from IP 192.168.1.1'
  },
  {
    id: '2',
    action: 'Loan Application',
    user: 'jane.smith@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'New loan application #LA-2024-001 submitted'
  },
  {
    id: '3',
    action: 'Payment Processed',
    user: 'robert.wilson@example.com',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Payment of $500.00 processed for loan #LA-2024-001'
  },
  {
    id: '4',
    action: 'User Login',
    user: 'sarah.parker@example.com',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    details: 'Failed login attempt - Invalid password'
  },
  {
    id: '5',
    action: 'Loan Application',
    user: 'michael.brown@example.com',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    details: 'Loan application #LA-2024-002 updated'
  },
  {
    id: '6',
    action: 'Payment Processed',
    user: 'emma.davis@example.com',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    details: 'Payment of $750.00 processed for loan #LA-2024-002'
  },
  {
    id: '7',
    action: 'User Login',
    user: 'david.miller@example.com',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    details: 'Successful login from IP 192.168.1.100'
  },
  {
    id: '8',
    action: 'Loan Application',
    user: 'lisa.white@example.com',
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    details: 'Loan application #LA-2024-003 rejected'
  },
  {
    id: '9',
    action: 'Payment Processed',
    user: 'james.taylor@example.com',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    details: 'Payment of $1000.00 processed for loan #LA-2024-003'
  },
  {
    id: '10',
    action: 'User Login',
    user: 'olivia.jones@example.com',
    timestamp: new Date(Date.now() - 32400000).toISOString(),
    details: 'Password reset requested'
  },
  {
    id: '11',
    action: 'Loan Application',
    user: 'william.clark@example.com',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    details: 'New loan application #LA-2024-004 submitted'
  },
  {
    id: '12',
    action: 'Payment Processed',
    user: 'sophia.martin@example.com',
    timestamp: new Date(Date.now() - 39600000).toISOString(),
    details: 'Payment of $1200.00 processed for loan #LA-2024-004'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 5

    const start = (page - 1) * limit
    const end = start + limit

    const paginatedLogs = allMockLogs.slice(start, end)

    const totalPages = Math.ceil(allMockLogs.length / limit)

    return NextResponse.json({
      logs: paginatedLogs,
      currentPage: page,
      totalPages,
      totalItems: allMockLogs.length
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 