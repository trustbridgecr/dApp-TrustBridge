"use client";

import { useState } from "react";
import { SearchBar } from "./utils/search-bar";
import { StatusFilter } from "./filters/status-filter";
import { RepaymentsTable } from "./tables/repayments-table";
import { Status } from "@/@types/repayment.entity";

export default function RepaymentsContent() {
  const [status, setStatus] = useState<Status>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight dark:text-gray-50">
        Repayments
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={setSearchQuery} />
        <StatusFilter selectedStatus={status} onStatusChange={setStatus} />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold tracking-tight dark:text-gray-100">
            Repayments Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track and manage all loan repayments.
          </p>
        </div>
        <RepaymentsTable searchQuery={searchQuery} statusFilter={status} />
      </div>
    </div>
  );
}
