"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import ParticlesBackground from "./ParticlesBackground"
import { Geist, Geist_Mono } from "next/font/google";



const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

interface Loan {
  id: string
  borrower: string
  type: "Home" | "Personal" | "Education" | "Business" | "Auto"
  amount: number
  remaining: number
  interestRate: number
  startDate: string
  lastPayment: string
  nextPayment: string
  status: "On Time" | "Late"
}

const sampleLoans: Loan[] = [
  {
    id: "LN87654",
    borrower: "Alice Thompson",
    type: "Home",
    amount: 18000,
    remaining: 9000,
    interestRate: 3.5,
    startDate: "2025-02-12",
    lastPayment: "2024-01-15",
    nextPayment: "2025-03-12",
    status: "On Time",
  },
  {
    id: "LN67891",
    borrower: "David Miller",
    type: "Personal",
    amount: 8000,
    remaining: 2500,
    interestRate: 6,
    startDate: "2025-02-25",
    lastPayment: "2023-03-12",
    nextPayment: "2025-03-25",
    status: "Late",
  },
  {
    id: "LN09876",
    borrower: "Emily Davis",
    type: "Education",
    amount: 15000,
    remaining: 3000,
    interestRate: 2.8,
    startDate: "2025-02-20",
    lastPayment: "2021-06-25",
    nextPayment: "2025-03-20",
    status: "On Time",
  },
  {
    id: "LN12345",
    borrower: "John Doe",
    type: "Personal",
    amount: 5000,
    remaining: 1500,
    interestRate: 5,
    startDate: "2025-02-10",
    lastPayment: "2023-01-15",
    nextPayment: "2025-03-10",
    status: "On Time",
  },
  {
    id: "LN54321",
    borrower: "Sarah Johnson",
    type: "Business",
    amount: 25000,
    remaining: 18750,
    interestRate: 4.2,
    startDate: "2025-01-05",
    lastPayment: "2024-02-05",
    nextPayment: "2025-03-05",
    status: "On Time",
  },
  {
    id: "LN98765",
    borrower: "Michael Brown",
    type: "Auto",
    amount: 12000,
    remaining: 7500,
    interestRate: 3.9,
    startDate: "2025-01-18",
    lastPayment: "2024-02-18",
    nextPayment: "2025-03-18",
    status: "On Time",
  },
  {
    id: "LN24680",
    borrower: "Jessica Wilson",
    type: "Home",
    amount: 32000,
    remaining: 28000,
    interestRate: 3.2,
    startDate: "2025-01-30",
    lastPayment: "2024-02-28",
    nextPayment: "2025-03-30",
    status: "Late",
  },
  {
    id: "LN13579",
    borrower: "Robert Garcia",
    type: "Education",
    amount: 9500,
    remaining: 4200,
    interestRate: 2.5,
    startDate: "2025-02-08",
    lastPayment: "2023-12-08",
    nextPayment: "2025-03-08",
    status: "Late",
  },
  {
    id: "LN36925",
    borrower: "Jennifer Martinez",
    type: "Personal",
    amount: 7000,
    remaining: 3500,
    interestRate: 5.5,
    startDate: "2025-02-15",
    lastPayment: "2024-01-15",
    nextPayment: "2025-03-15",
    status: "On Time",
  },
  {
    id: "LN80246",
    borrower: "Thomas Anderson",
    type: "Business",
    amount: 45000,
    remaining: 38000,
    interestRate: 4.8,
    startDate: "2025-01-10",
    lastPayment: "2024-02-10",
    nextPayment: "2025-03-10",
    status: "On Time",
  },
  {
    id: "LN71539",
    borrower: "Lisa Rodriguez",
    type: "Auto",
    amount: 15000,
    remaining: 9800,
    interestRate: 4.1,
    startDate: "2025-01-22",
    lastPayment: "2023-11-22",
    nextPayment: "2025-03-22",
    status: "Late",
  },
  {
    id: "LN62048",
    borrower: "Kevin Taylor",
    type: "Home",
    amount: 28000,
    remaining: 22500,
    interestRate: 3.7,
    startDate: "2025-02-05",
    lastPayment: "2024-02-05",
    nextPayment: "2025-03-05",
    status: "On Time",
  },
]




const statusOptions = ["All Status", "On Time", "Late"]

export default function ActiveLoansTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Loan | null
    direction: "ascending" | "descending" | null
  }>({
    key: null,
    direction: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [animateRows, setAnimateRows] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && event.target instanceof Element) {
        const dropdownElement = document.querySelector(".dropdown-container")
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAnimateRows(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredLoans = sampleLoans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All Status" || loan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: keyof Loan) => {
    let direction: "ascending" | "descending" | null = "ascending"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending"
      } else if (sortConfig.direction === "descending") {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return dateString.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedLoans.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedLoans.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const LoadingSkeleton = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <TableRow key={index} className="animate-pulse border-b border-[#1e2d3d]">
          {[...Array(10)].map((_, cellIndex) => (
            <TableCell key={cellIndex} className="px-4 py-4">
              <div className="h-4 bg-[#1e2d3d] rounded w-3/4"></div>
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <div className={`w-full min-h-screen bg-[#0a101f] text-white relative ${geistMono.className}`}>
      <ParticlesBackground />

      <div className="relative z-10">
        <div className="px-6 py-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium text-[#0ff]">Active Loans</h2>
            <div className="h-1 w-28 bg-gradient-to-r from-[#0066ff] to-[#00ff99] rounded-full mt-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#0ff]"></div>
            <span className="text-[#0ff]">{filteredLoans.length} Active Loans</span>
          </div>
        </div>

        <div className="px-6 py-4 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-[#0ff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-text"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
              <h3 className="text-lg font-medium">Active Loans</h3>
            </div>
            <div className="flex-1"></div>
            <div className="relative w-64 transition-all duration-300 hover:scale-[1.02]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by borrower or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-[#1e2d3d] bg-[#0a101f] pl-9 text-gray-300 focus:border-[#0ff] focus:ring-0 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Button
                variant="outline"
                className="h-10 border border-[#1e2d3d] bg-[#0a101f] text-gray-300 hover:bg-[#1e2d3d] hover:text-white transition-all duration-300 flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter}
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-[160px] bg-[#0a101f] border border-[#1e2d3d] rounded-md overflow-hidden z-50 animate-fadeIn shadow-lg dropdown-container">
                  <div className="py-1 border-b border-[#1e2d3d]">
                    <button
                      onClick={() => {
                        setStatusFilter("All Status")
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-[#0ff] font-medium hover:bg-[#1e2d3d] transition-colors"
                    >
                      All Status
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setStatusFilter("On Time")
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#1e2d3d] transition-colors"
                    >
                      <div className="rounded-full bg-[#003b29] text-[#00ff99] px-3 py-1 text-center text-sm w-fit">
                        On Time
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("Late")
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#1e2d3d] transition-colors"
                    >
                      <div className="rounded-full bg-[#3b0000] text-[#ff0000] px-3 py-1 text-center text-sm w-fit">
                        Late
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden border-t border-l border-r border-[#1e2d3d] animate-fadeIn backdrop-blur-sm bg-[#0a101f]/70">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#1e2d3d] hover:bg-transparent">
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      Loan ID
                      {sortConfig.key === "id" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("borrower")}
                  >
                    <div className="flex items-center">
                      Borrower
                      {sortConfig.key === "borrower" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-[#0ff] font-medium px-4">Loan Type</TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortConfig.key === "amount" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("remaining")}
                  >
                    <div className="flex items-center">
                      Remaining
                      {sortConfig.key === "remaining" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("interestRate")}
                  >
                    <div className="flex items-center">
                      Interest Rate
                      {sortConfig.key === "interestRate" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center">
                      Start Date
                      {sortConfig.key === "startDate" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-[#0ff] font-medium px-4">Last Payment</TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("nextPayment")}
                  >
                    <div className="flex items-center">
                      Next Payment
                      {sortConfig.key === "nextPayment" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-[#0ff] font-medium hover:text-[#0ff]/80 px-4 cursor-pointer transition-all duration-200"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" && (
                        <ArrowUpDown
                          className={cn(
                            "ml-1 h-3 w-3 transition-transform duration-300",
                            sortConfig.direction === "descending" && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-gray-400">
                      No loans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((loan, index) => (
                    <TableRow
                      key={loan.id}
                      className={cn(
                        "group border-b border-[#1e2d3d] transition-all duration-300 hover:bg-[#1e2d3d]/50",
                        animateRows && "animate-rowFadeIn",
                        `animate-delay-${index * 100}`,
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium text-white px-4">{loan.id}</TableCell>
                      <TableCell className="text-white px-4">{loan.borrower}</TableCell>
                      <TableCell className="px-4">
                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-center text-sm text-[#0ff] w-fit transition-all duration-300 hover:scale-105",
                            loan.type === "Home" && "bg-[#1e3a57]",
                            loan.type === "Personal" && "bg-[#2d1e57]",
                            loan.type === "Education" && "bg-[#1e5741]",
                            loan.type === "Business" && "bg-[#573e1e]",
                            loan.type === "Auto" && "bg-[#3a1e57]",
                          )}
                        >
                          {loan.type}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#00ff99] px-4">{formatCurrency(loan.amount)}</TableCell>
                      <TableCell className="text-[#00ff99] px-4">{formatCurrency(loan.remaining)}</TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <span className="text-white">%</span>
                          <span className="ml-1 text-white">{loan.interestRate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white px-4">{formatDate(loan.startDate)}</TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-calendar text-gray-400 mr-1"
                          >
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                          </svg>
                          <span className="text-white">{formatDate(loan.lastPayment)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-circle text-gray-400 mr-1"
                          >
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          <span className="text-white">{formatDate(loan.nextPayment)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-center text-sm w-fit transition-all duration-300 hover:scale-105",
                            loan.status === "On Time" && "bg-[#003b29] text-[#00ff99]",
                            loan.status === "Late" && "bg-[#3b0000] text-[#ff0000]",
                          )}
                        >
                          {loan.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 text-gray-400 text-sm animate-fadeIn backdrop-blur-sm bg-[#0a101f]/70">
            <div>
              Showing <span className="text-white">{indexOfFirstItem + 1}</span> to{" "}
              <span className="text-white">{Math.min(indexOfLastItem, sortedLoans.length)}</span> of{" "}
              <span className="text-white">{sortedLoans.length}</span> loans
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border border-[#1e2d3d] bg-[#0a101f] text-gray-300 hover:bg-[#1e2d3d] hover:text-white transition-all duration-300"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border border-[#1e2d3d] bg-[#0a101f] text-gray-300 hover:bg-[#1e2d3d] hover:text-white transition-all duration-300"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}