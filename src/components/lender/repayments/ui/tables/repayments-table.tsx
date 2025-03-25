'use client';

import {
  CircleCheckBig,
  Clock4,
  MoreHorizontal,
  TriangleAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/bage';
import { Status } from '@/@types/repayment.entity';
import { useRepaymentsTable } from './hooks/repayments-table.hooks';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className='bg-[#0F1927] border border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-5 w-full'>
      {/* Desktop Table */}
      <div className='hidden md:block'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-0'>
                {renderSortButton('Repayment ID', 'id')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Borrower', 'borrower')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Loan ID', 'loanId')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Amount ($)', 'amount')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Due Date', 'dueDate')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Status', 'status')}
              </TableHead>
              <TableHead className='text-[#63CDE6] font-semibold'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow className='text-gray-300 '>
                <TableCell colSpan={7} className='h-24 text-center'>
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((repayment) => (
                <TableRow key={repayment.id}>
                  <TableCell className='font-medium text-gray-300'>
                    {repayment.id}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {repayment.borrower}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {repayment.loanId}
                  </TableCell>
                  <TableCell className='text-[#6AD09E]'>
                    {repayment.amount}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {repayment.dueDate}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    <Badge
                      className={
                        repayment.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center gap-2 w-fit rounded-full'
                          : repayment.status === 'overdue'
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center gap-2 w-fit rounded-full'
                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 flex items-center gap-2 w-fit rounded-full'
                      }
                      variant='secondary'
                      style={{
                        width: 'fit-content',
                      }}
                    >
                      {repayment.status === 'upcoming' && (
                        <Clock4 className='w-4 h-4' />
                      )}
                      {repayment.status === 'overdue' && (
                        <TriangleAlert className='w-4 h-4' />
                      )}
                      {repayment.status === 'paid' && (
                        <CircleCheckBig className='w-4 h-4' />
                      )}
                      {repayment.status.charAt(0).toUpperCase() +
                        repayment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0 hover:bg-[#1C2A3E]/30'
                        >
                          <MoreHorizontal className='h-4 w-4 text-gray-300' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='bg-[#1C2530] border-none text-white'
                      >
                        <DropdownMenuItem className='hover:!bg-[#1C2A3E]/50 hover:!text-white'>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem className='hover:!bg-[#1C2A3E]/50 hover:!text-white'>
                          Mark as paid
                        </DropdownMenuItem>
                        <DropdownMenuItem className='hover:!bg-[#1C2A3E]/50 hover:!text-white'>
                          Send reminder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Table */}
      <div className='block md:hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-0'>
                {renderSortButton('Repayment ID', 'id')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Amount ($)', 'amount')}
              </TableHead>
              <TableHead className='px-0'>
                {renderSortButton('Status', 'status')}
              </TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((repayment) => (
              <>
                <TableRow
                  key={repayment.id}
                  className='cursor-pointer'
                  onClick={() => toggleRow(repayment.id)}
                >
                  <TableCell className='font-medium text-gray-300'>
                    {repayment.id}
                  </TableCell>
                  <TableCell className='text-[#6AD09E]'>
                    ${repayment.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        repayment.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-400 flex items-center gap-2 w-fit rounded-full'
                          : repayment.status === 'overdue'
                            ? 'bg-red-500/10 text-red-400 flex items-center gap-2 w-fit rounded-full'
                            : 'bg-green-500/10 text-green-400 flex items-center gap-2 w-fit rounded-full'
                      }
                      variant='secondary'
                    >
                      {repayment.status === 'upcoming' && (
                        <Clock4 className='w-4 h-4' />
                      )}
                      {repayment.status === 'overdue' && (
                        <TriangleAlert className='w-4 h-4' />
                      )}
                      {repayment.status === 'paid' && (
                        <CircleCheckBig className='w-4 h-4' />
                      )}
                      {repayment.status.charAt(0).toUpperCase() +
                        repayment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expandedRows.includes(repayment.id) ? (
                      <ChevronUp className='w-4 h-4 text-gray-400' />
                    ) : (
                      <ChevronDown className='w-4 h-4 text-gray-400' />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  className={cn(
                    'bg-slate-950/10',
                    !expandedRows.includes(repayment.id) && 'hidden'
                  )}
                >
                  <TableCell colSpan={4} className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-sm text-gray-400'>Borrower</span>
                        <span className='text-sm text-gray-300'>
                          {repayment.borrower}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm text-gray-400'>Loan ID</span>
                        <span className='text-sm text-gray-300'>
                          {repayment.loanId}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm text-gray-400'>Due Date</span>
                        <span className='text-sm text-gray-300'>
                          {repayment.dueDate}
                        </span>
                      </div>
                      <div className='flex justify-end gap-2 mt-4'>
                        <Button variant='outline' size='sm'>
                          View details
                        </Button>
                        <Button variant='outline' size='sm'>
                          Mark as paid
                        </Button>
                        <Button variant='outline' size='sm'>
                          Send reminder
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
    </div>
  );
}
