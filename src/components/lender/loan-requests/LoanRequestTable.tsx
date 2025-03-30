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
import { useLoanRequests } from "./hooks/useLoanRequests";

interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  creditScore: number;
  status: string;
}

export function LoanRequestsTable() {
  const { t } = useTranslation();
  const { loading, error, loanRequests } = useLoanRequests();
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    filterRequests(searchQuery, statusFilter);
  }, [loanRequests, searchQuery, statusFilter]);

  const filterRequests = (query: string, status: string) => {
    setIsFiltering(true);
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
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500">
        <p>Error loading loan requests: {error.message}</p>
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-4 md:p-[4rem]">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              {t("loanRequests.title")}
            </h1>
            <div className="flex flex-col gap-[3px]">
              <div className="h-[3px] max-w-[160px] bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
              <div className="h-[2px] max-w-28 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="rounded-full w-fit ml-auto py-2 px-3 flex justify-center items-center gap-3 sm:px-4 dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] self-start md:self-auto hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.25)] transition-all duration-300">
            <div className="h-2 w-2 md:w-4 md:h-4 bg-[#63CDE6] rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-100 text-sm">5 Pending requests</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300">
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
                <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
                <StatusFilter statusFilter={statusFilter} setStatusFilter={handleStatusFilter} />
              </div>
            </div>
          </div>

          {/* Content: Loading, Error, Empty or Table - OMITTED HERE FOR BREVITY */}
          {/* Puedes seguir con el resto del contenido según ya lo tenías en la fusión */}
        </div>
      </div>
    </div>
  );
}
