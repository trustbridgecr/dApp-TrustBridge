import { TotalLoanRequests } from "@/components/admin/dashboard/TotalLoanRequests"
import { ActiveLoans } from "@/components/admin/dashboard/ActiveLoans"
import { TotalValueLocked } from "@/components/admin/dashboard/TotalValueLocked"
import { RepaymentRate } from "@/components/admin/dashboard/RepaymentRate"
import { LoanVolume } from "@/components/admin/dashboard/LoanVolume"
import { RecentLoanRequests } from "@/components/admin/dashboard/RecentLoanRequests"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-black dark:text-white text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalLoanRequests />
        <ActiveLoans />
        <TotalValueLocked />
        <RepaymentRate />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <LoanVolume />
        <RecentLoanRequests />
      </div>
    </div>
  )
}

