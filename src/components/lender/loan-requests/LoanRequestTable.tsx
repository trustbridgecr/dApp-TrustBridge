"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatusFilter from "./StatusFilter"
import { SearchBar } from "./SearchBar"
import { Actions } from "./Actions"
import { useLoanRequests } from "./hooks/useLoanRequests"

// Define an interface for the loan request object
interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  creditScore: number;
  status: string;
}

export function LoanRequestsTable() {
  const { t } = useTranslation()
  const { loading, error, loanRequests } = useLoanRequests();
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>(loanRequests)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Update filtered requests when the data changes
  useEffect(() => {
    filterRequests(searchQuery, statusFilter);
  }, [loanRequests, searchQuery, statusFilter]);

  const filterRequests = (query: string, status: string) => {
    let filtered = loanRequests.filter(
      (req: LoanRequest) =>
        req.borrower.toLowerCase().includes(query.toLowerCase()) || req.id.toLowerCase().includes(query.toLowerCase()),
    );
  
    if (status !== "all") {
      filtered = filtered.filter((req: LoanRequest) => req.status === status); 
    }
    setFilteredRequests(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterRequests(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterRequests(searchQuery, status)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-red-500">
      <p>Error loading loan requests: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="space-y-4 p-[4rem]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold dark:text-white">{t("loanRequests.title")}</h1>
        </div>
        <div className="flex gap-2 items-center">
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <StatusFilter statusFilter={statusFilter} setStatusFilter={handleStatusFilter} />
        </div>
        <section className="border rounded-xl p-[2rem] dark:border dark:border-gray-700">
          <h1 className="text-2xl font-bold dark:text-white">{t("loanRequests.subtitle")}</h1>
          <p className="mt-1 mb-4 text-gray-400 dark:text-gray-400">{t("loanRequests.description")}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.requestId")}</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.borrower")}</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.amount")}</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.purpose")}</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.creditScore")}</TableHead>
                <TableHead className="cursor-pointer dark:text-gray-400">{t("loanRequests.table.status")}</TableHead>
                <TableHead className="dark:text-gray-400">{t("loanRequests.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="dark:text-gray-300">{request.id}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.borrower}</TableCell>
                  <TableCell className="dark:text-gray-300">
                    {t("common.currency.format", { amount: request.amount.toLocaleString() })}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{request.purpose}</TableCell>
                  <TableCell className="dark:text-gray-300">{request.creditScore}</TableCell>
                  <TableCell className="dark:text-gray-300">{t(`status.${request.status}`)}</TableCell>
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
