"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Wallet,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Loan Requests",
      icon: Users,
      href: "/admin/loan-requests",
    },
    {
      label: "Active Loans",
      icon: CreditCard,
      href: "/admin/active-loans",
    },
    {
      label: "Repayments",
      icon: DollarSign,
      href: "/admin/repayments",
    },
    {
      label: "Wallet",
      icon: Wallet,
      href: "/admin/wallet",
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen w-64 bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">TrustBridge</h2>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="space-y-2">
            {routes.map((route) => (
              <Link 
                key={route.href} 
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors",
                  pathname === route.href && "text-gray-900 bg-gray-100"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="text-base">{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <Sidebar />
    </div>
  )
}