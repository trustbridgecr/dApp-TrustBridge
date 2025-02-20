"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/bage";
import { Status } from "@/@types/repayment.entity";
import { useRepaymentsTable } from "./hooks/repayments-table.hooks";

export interface RepaymentsTableProps {
  searchQuery: string;
  statusFilter: Status;
}

export function RepaymentsTable({
  searchQuery,
  statusFilter,
}: RepaymentsTableProps) {
  const { filteredAndSortedData, renderSortButton } = useRepaymentsTable({
    searchQuery,
    statusFilter,
  });

  return (
    <div className="rounded-md border p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortButton("Repayment ID", "id")}</TableHead>
            <TableHead>{renderSortButton("Borrower", "borrower")}</TableHead>
            <TableHead>{renderSortButton("Loan ID", "loanId")}</TableHead>
            <TableHead>{renderSortButton("Amount ($)", "amount")}</TableHead>
            <TableHead>{renderSortButton("Due Date", "dueDate")}</TableHead>
            <TableHead>{renderSortButton("Status", "status")}</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedData.length === 0 ? (
            <TableRow className="dark:text-gray-300">
              <TableCell colSpan={7} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedData.map((repayment) => (
              <TableRow key={repayment.id}>
                <TableCell className="font-medium dark:text-gray-300">
                  {repayment.id}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {repayment.borrower}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {repayment.loanId}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {repayment.amount}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {repayment.dueDate}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  <Badge
                    className={
                      repayment.status === "upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : repayment.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                    }
                    variant="secondary"
                  >
                    {repayment.status.charAt(0).toUpperCase() +
                      repayment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 dark:text-gray-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Mark as paid</DropdownMenuItem>
                      <DropdownMenuItem>Send reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
