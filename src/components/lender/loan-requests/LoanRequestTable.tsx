"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusFilter from "./StatusFilter";
import { SearchBar } from "./SearchBar";
import { Actions } from "./Actions";
import {
  Clock,
  CircleCheckBig,
  CircleAlert,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  creditScore: number;
  status: string;
}

const loanRequests: LoanRequest[] = [
  {
    id: "LR001",
    borrower: "Alice Johnson",
    amount: 5000,
    purpose: "Business Expansion",
    creditScore: 720,
    status: "pending",
  },
  {
    id: "LR002",
    borrower: "Bob Smith",
    amount: 3500,
    purpose: "Debt Consolidation",
    creditScore: 680,
    status: "under_review",
  },
  {
    id: "LR003",
    borrower: "Carol Williams",
    amount: 7000,
    purpose: "Home Improvement",
    creditScore: 750,
    status: "pending",
  },
  {
    id: "LR004",
    borrower: "David Brown",
    amount: 2000,
    purpose: "Education",
    creditScore: 700,
    status: "approved",
  },
  {
    id: "LR005",
    borrower: "Eva Davis",
    amount: 10000,
    purpose: "Start-up Funding",
    creditScore: 780,
    status: "under_review",
  },
];

export function LoanRequestsTable() {
  const { t } = useTranslation();
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredRequests(loanRequests);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filterRequests = (query: string, status: string) => {
    setIsFiltering(true);

    // Simulate network delay for filtering
    setTimeout(() => {
      let filtered = loanRequests.filter(
        (req) =>
          req.borrower.toLowerCase().includes(query.toLowerCase()) ||
          req.id.toLowerCase().includes(query.toLowerCase())
      );

      if (status !== "all") {
        filtered = filtered.filter((req) => req.status === status);
      }

      setFilteredRequests(filtered);
      setIsFiltering(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterRequests(query, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterRequests(searchQuery, status);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-4 md:p-[4rem]">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
          <div className="flex flex-col gap-2">
            <h1
              className="text-2xl md:text-3xl font-bold bg-gradient-to-br
           from-green-400 to-blue-600 bg-clip-text text-transparent animate-gradient-x"
            >
              {t("loanRequests.title")}
            </h1>
            <div className="flex flex-col gap-[3px]">
              <div
                className="h-[3px] max-w-[160px] bg-gradient-to-br
           from-green-400 to-blue-600 rounded-full animate-pulse"
              ></div>
              <div
                className="h-[2px] max-w-28 bg-gradient-to-br
           from-green-400 to-blue-600 rounded-full animate-pulse"
              ></div>
            </div>
          </div>

          <div
            className="rounded-full w-fit ml-auto py-2 px-3 flex justify-center items-center gap-3  
             sm:px-4 dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 
        shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] self-start md:self-auto
        hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.25)] transition-all duration-300"
          >
            <div className="h-2 w-2 md:w-4 md:h-4 bg-[#63CDE6] rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-100 text-sm ">5 Pending requests</p>
            </div>
          </div>
        </div>

        <div
          className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 
        shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full
        hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row flex-wrap gap-4 md:gap-0 md:justify-between md:items-center mb-4">
            <div className="w-full lg:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                {t("loanRequests.subtitle")}
              </h1>
              <p className="mt-1 mb-4 text-sm md:text-base text-gray-400 dark:text-gray-400">
                {t("loanRequests.description")}
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="flex flex-col md:flex-row md:justify-end gap-2 items-start md:items-center">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={handleSearch}
                />
                <StatusFilter
                  statusFilter={statusFilter}
                  setStatusFilter={handleStatusFilter}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#63CDE6] animate-spin mb-4" />
              <p className="text-gray-400 dark:text-gray-400">
                Loading loan requests...
              </p>
            </div>
          )}

          {/* Filtering State */}
          {!isLoading && isFiltering && (
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#63CDE6] animate-spin mb-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  Updating results...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isFiltering && filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                <CircleAlert className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                No loan requests found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Try adjusting your filters
              </p>
              <Button
                variant="outline"
                className="mt-4 hover:bg-[#63CDE6]/10 transition-colors duration-300"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  filterRequests("", "all");
                }}
              >
                Reset filters
              </Button>
            </div>
          )}

          {/* Desktop Table */}
          {!isLoading && !isFiltering && filteredRequests.length > 0 && (
            <div className="hidden md:block animate-fade-in">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.requestId")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.borrower")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.amount")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.purpose")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.creditScore")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.status")}
                    </TableHead>
                    <TableHead className="dark:text-[#63CDE6]">
                      {t("loanRequests.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => (
                    <TableRow
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#0A1420] transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                        {request.id}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                        {request.borrower}
                      </TableCell>
                      <TableCell className="text-[#6AD09E] group-hover:text-[#8CEEBC] transition-colors duration-200">
                        {t("common.currency.format", {
                          amount: request.amount.toLocaleString(),
                        })}
                      </TableCell>
                      <TableCell className="w-fit px-2 ">
                        <p className="rounded-full w-fit bg-blue-900/20 text-sky-300 py-1 px-3 hover:bg-blue-900/30 transition-colors duration-200">
                          {request.purpose}
                        </p>
                      </TableCell>
                      <TableCell className="dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                        {request.creditScore}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit transition-all duration-300 ${
                            request.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                              : request.status === "approved"
                                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                : request.status === "under_review"
                                  ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                  : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                          }`}
                        >
                          {request.status === "pending" && (
                            <Clock className="h-4 w-4 text-yellow-300 animate-pulse" />
                          )}
                          {request.status === "approved" && (
                            <CircleCheckBig className="h-4 w-4 text-green-300" />
                          )}
                          {request.status === "under_review" && (
                            <CircleAlert className="h-4 w-4 text-blue-300" />
                          )}
                          {t(`status.${request.status}`)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Actions />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Table */}
          {!isLoading && !isFiltering && filteredRequests.length > 0 && (
            <div className="block md:hidden animate-fade-in">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-2 text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.requestId")}
                    </TableHead>
                    <TableHead className="px-2 text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.amount")}
                    </TableHead>
                    <TableHead className="px-2 text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200">
                      {t("loanRequests.table.status")}
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => (
                    <>
                      <TableRow
                        key={request.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0A1420] transition-colors duration-200 animate-fade-in"
                        onClick={() => toggleRow(request.id)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium dark:text-gray-300 px-2">
                          {request.id}
                        </TableCell>
                        <TableCell className="text-[#6AD09E] px-2">
                          {t("common.currency.format", {
                            amount: request.amount.toLocaleString(),
                          })}
                        </TableCell>
                        <TableCell className="px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit transition-all duration-300 ${
                              request.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                                : request.status === "approved"
                                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                  : request.status === "under_review"
                                    ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                    : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                            }`}
                          >
                            {request.status === "pending" && (
                              <Clock className="h-3 w-3 animate-pulse" />
                            )}
                            {request.status === "approved" && (
                              <CircleCheckBig className="h-3 w-3" />
                            )}
                            {request.status === "under_review" && (
                              <CircleAlert className="h-3 w-3" />
                            )}
                            {t(`status.${request.status}`)}
                          </span>
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="transition-transform duration-200 ease-in-out">
                            {expandedRows.includes(request.id) ? (
                              <ChevronUp className="w-4 h-4 dark:text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 dark:text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={`${request.id}-expanded`}
                        className={cn(
                          "dark:bg-slate-950/10 transition-all duration-300",
                          expandedRows.includes(request.id)
                            ? "animate-accordion-down"
                            : "animate-accordion-up hidden"
                        )}
                      >
                        <TableCell colSpan={4} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-400">
                                {t("loanRequests.table.borrower")}
                              </span>
                              <span className="text-sm dark:text-gray-300">
                                {request.borrower}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-400">
                                {t("loanRequests.table.purpose")}
                              </span>
                              <span className="sm:text-sm dark:text-sky-300 bg-blue-900/20 px-2 py-0.5 rounded-full text-xs hover:bg-blue-900/30 transition-colors duration-200">
                                {request.purpose}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-400">
                                {t("loanRequests.table.creditScore")}
                              </span>
                              <span className="text-sm dark:text-gray-300">
                                {request.creditScore}
                              </span>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-[#63CDE6]/10 transition-colors duration-300"
                              >
                                View details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-[#63CDE6]/10 transition-colors duration-300"
                              >
                                Review
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
