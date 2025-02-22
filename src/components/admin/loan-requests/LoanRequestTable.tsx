"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatusFilter from "./StatusFilter"
import { SearchBar } from "./SearchBar"
import { Actions } from "./Actions"

interface LoanRequest {
  id: string
  borrower: string
  amount: number
  purpose: string
  creditScore: number
  status: string
}

const loanRequests: LoanRequest[] = [
  {
    id: "LR001",
    borrower: "Alice Johnson",
    amount: 5000,
    purpose: "Business Expansion",
    creditScore: 720,
    status: "Pending",
  },
  {
    id: "LR002",
    borrower: "Bob Smith",
    amount: 3500,
    purpose: "Debt Consolidation",
    creditScore: 680,
    status: "Under Review",
  },
  {
    id: "LR003",
    borrower: "Carol Williams",
    amount: 7000,
    purpose: "Home Improvement",
    creditScore: 750,
    status: "Pending",
  },
  { id: "LR004", borrower: "David Brown", amount: 2000, purpose: "Education", creditScore: 700, status: "Approved" },
  {
    id: "LR005",
    borrower: "Eva Davis",
    amount: 10000,
    purpose: "Start-up Funding",
    creditScore: 780,
    status: "Under Review",
  },
]

export function LoanRequestsTable() {
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>(loanRequests)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses")
  const [isDark, setIsDark] = useState(false)

  const filterRequests = (query: string, status: string) => {
    let filtered = loanRequests.filter(
      (req) =>
        req.borrower.toLowerCase().includes(query.toLowerCase()) || req.id.toLowerCase().includes(query.toLowerCase()),
    )

    if (status !== "All Statuses") {
      filtered = filtered.filter((req) => req.status === status)
    }
    setFilteredRequests(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterRequests(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterRequests(searchQuery, status)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-4 p-[4rem]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold dark:text-white">Loan Requests</h1>
        </div>
        <div className="flex gap-2 items-center">
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <StatusFilter statusFilter={statusFilter} setStatusFilter={handleStatusFilter} />
        </div>
        <section className="border rounded-xl p-[2rem]">
          <h1 className="text-2xl font-bold dark:text-white">All Loan Requests</h1>
          <p className="mt-1 mb-4 text-[#9C9EA8] dark:text-gray-400">
            A list of all loan requests from borrowers. Review and take action.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer dark:text-gray-400">Request ID</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">Borrower</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">Amount ($)</TableHead>
                <TableHead className="dark:text-gray-400">Purpose</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">Credit Score</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">Status</TableHead>
                <TableHead className="dark:text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="dark:text-gray-300">{request.id}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.borrower}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.amount.toLocaleString()}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.purpose}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.creditScore}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.status}</TableCell>
                  <TableCell>
                    <Actions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  )
}

