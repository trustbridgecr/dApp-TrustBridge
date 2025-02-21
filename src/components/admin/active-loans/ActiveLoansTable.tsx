"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import SearchBar from './SearchBar';
import StatusFilter from './StatusFilter';

const loansData = [
    {
      id: 'LN12345',
      borrower: 'John Doe',
      amount: 5000,
      remainingBalance: 1500,
      interestRate: '5%',
      startDate: '2023-01-15',
      nextPayment: '2025-03-10',
      lastPayment: '2025-02-10',
      paymentsMade: 24,
      loanType: 'Personal',
      status: 'On Time'
    },
    {
      id: 'LN67890',
      borrower: 'Jane Smith',
      amount: 10000,
      remainingBalance: 8000,
      interestRate: '3%',
      startDate: '2024-02-20',
      nextPayment: '2025-03-05',
      lastPayment: '2025-02-05',
      paymentsMade: 12,
      loanType: 'Home',
      status: 'Late'
    },
    {
      id: 'LN54321',
      borrower: 'Michael Johnson',
      amount: 20000,
      remainingBalance: 12000,
      interestRate: '4.5%',
      startDate: '2022-05-10',
      nextPayment: '2025-03-15',
      lastPayment: '2025-02-15',
      paymentsMade: 36,
      loanType: 'Car',
      status: 'On Time'
    },
    {
      id: 'LN09876',
      borrower: 'Emily Davis',
      amount: 15000,
      remainingBalance: 3000,
      interestRate: '2.8%',
      startDate: '2021-08-25',
      nextPayment: '2025-03-20',
      lastPayment: '2025-02-20',
      paymentsMade: 42,
      loanType: 'Education',
      status: 'On Time'
    },
    {
      id: 'LN67891',
      borrower: 'David Miller',
      amount: 8000,
      remainingBalance: 2500,
      interestRate: '6%',
      startDate: '2023-03-12',
      nextPayment: '2025-03-25',
      lastPayment: '2025-02-25',
      paymentsMade: 22,
      loanType: 'Personal',
      status: 'Late'
    },
    {
      id: 'LN78901',
      borrower: 'Sophia Wilson',
      amount: 30000,
      remainingBalance: 18000,
      interestRate: '3.2%',
      startDate: '2022-11-01',
      nextPayment: '2025-03-30',
      lastPayment: '2025-02-28',
      paymentsMade: 26,
      loanType: 'Home',
      status: 'On Time'
    },
    {
      id: 'LN23456',
      borrower: 'Chris Brown',
      amount: 12000,
      remainingBalance: 4000,
      interestRate: '4%',
      startDate: '2022-07-10',
      nextPayment: '2025-03-18',
      lastPayment: '2025-02-18',
      paymentsMade: 30,
      loanType: 'Car',
      status: 'On Time'
    },
    {
      id: 'LN34567',
      borrower: 'Olivia Thompson',
      amount: 25000,
      remainingBalance: 15000,
      interestRate: '3.5%',
      startDate: '2023-04-05',
      nextPayment: '2025-03-12',
      lastPayment: '2025-02-12',
      paymentsMade: 20,
      loanType: 'Home',
      status: 'Late'
    },
    {
      id: 'LN45678',
      borrower: 'Noah Garcia',
      amount: 7000,
      remainingBalance: 2000,
      interestRate: '6.5%',
      startDate: '2023-06-15',
      nextPayment: '2025-03-14',
      lastPayment: '2025-02-14',
      paymentsMade: 18,
      loanType: 'Personal',
      status: 'On Time'
    },
    {
      id: 'LN56789',
      borrower: 'Ava Martinez',
      amount: 22000,
      remainingBalance: 10000,
      interestRate: '3.9%',
      startDate: '2022-09-20',
      nextPayment: '2025-03-16',
      lastPayment: '2025-02-16',
      paymentsMade: 28,
      loanType: 'Education',
      status: 'On Time'
    }
  ];
  

const ActiveLoansTable = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = loansData.filter(loan =>
    (loan.borrower.toLowerCase().includes(search.toLowerCase()) || loan.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter !== 'all' ? loan.status === statusFilter : true)
  );

  return (
    <Card className="shadow-lg border border-gray-700">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-white">Active Loans</CardTitle>
        <CardDescription className="text-gray-400">
          Overview of all active loans with detailed payment statuses.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Search Bar and Status Filter */}
        <div className="flex justify-between items-center mb-4">
          <SearchBar search={search} setSearch={setSearch} />
          <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        </div>

        {/* Active Loans Table */}
        <Table className="text-white">
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Remaining Balance</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Last Payment Date</TableHead>
              <TableHead>Next Payment Date</TableHead>
              <TableHead>Payments Made</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell className="font-semibold">{loan.borrower}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>${loan.amount}</TableCell>
                <TableCell>${loan.remainingBalance}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>{loan.startDate}</TableCell>
                <TableCell>{loan.lastPayment}</TableCell>
                <TableCell>{loan.nextPayment}</TableCell>
                <TableCell>{loan.paymentsMade}</TableCell>
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
