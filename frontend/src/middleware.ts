// frontend/src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle marketplace role-based routing
  if (pathname.startsWith('/dashboard/marketplace')) {
    // Get role from cookies or headers (since we can't access localStorage in middleware)
    const userRole = request.cookies.get('userRole')?.value
    
    // If accessing specific role pages without proper role selection
    if (pathname.includes('/borrower') && userRole !== 'borrower') {
      return NextResponse.redirect(new URL('/dashboard/marketplace', request.url))
    }
    
    if (pathname.includes('/lender') && userRole !== 'lender') {
      return NextResponse.redirect(new URL('/dashboard/marketplace', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/marketplace/:path*'
}