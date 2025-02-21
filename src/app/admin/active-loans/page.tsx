"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

const loansData = [
  { id: 'LN12345', borrower: 'John Doe', amount: 5000, remainingBalance: 1500, interestRate: '5%', nextPayment: '2025-03-10', status: 'On Time' },
  { id: 'LN67890', borrower: 'Jane Smith', amount: 10000, remainingBalance: 8000, interestRate: '3%', nextPayment: '2025-03-05', status: 'Late' }
];

const ActiveLoansTable = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = loansData.filter(loan =>
    (loan.borrower.toLowerCase().includes(search.toLowerCase()) || loan.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter !== 'all' ? loan.status === statusFilter : true)
  );

  return (
    <Card>
      <CardContent>
        {/* Search Bar and Status Filter */}
        <div className="flex justify-between items-center mb-4">
          <Input 
            placeholder="Search by Borrower or Loan ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="On Time">On Time</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Loans Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Remaining Balance</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Next Payment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>${loan.amount}</TableCell>
                <TableCell>${loan.remainingBalance}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>{loan.nextPayment}</TableCell>
                <TableCell>
                  <Badge variant={loan.status === 'On Time' ? 'secondary' : 'destructive'}>
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <MoreVertical className="cursor-pointer" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveLoansTable;
