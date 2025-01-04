"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const currentLoan = {
  amount: 1000,
  paid: 400,
  nextPaymentDate: "2023-07-15",
  interestRate: 5,
};

const paymentHistory = [
  { date: "2023-05-15", amount: 200 },
  { date: "2023-06-15", amount: 200 },
];

const paymentSchedule = [
  { date: "2023-07-15", amount: 200 },
  { date: "2023-08-15", amount: 200 },
  { date: "2023-09-15", amount: 200 },
];

export function DashboardContent() {
  const percentagePaid = (currentLoan.paid / currentLoan.amount) * 100;

  return (
    <main className="flex-1 p-6 bg-white dark:bg-[#18181B] text-black dark:text-white">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-left mb-6">Dashboard</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">Current Loan Status</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Summary of your active loan</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total amount:</span>
                    <span className="font-medium text-black dark:text-white">${currentLoan.amount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount paid:</span>
                    <span className="font-medium text-black dark:text-white">${currentLoan.paid}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Next payment:</span>
                    <span className="font-medium text-black dark:text-white">{currentLoan.nextPaymentDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Interest rate:</span>
                    <span className="font-medium text-black dark:text-white">{currentLoan.interestRate}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={percentagePaid} className="h-2 bg-gray-200 dark:bg-gray-700" />
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400">{percentagePaid.toFixed(2)}% paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-black dark:text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 dark:text-gray-400">Date</TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-black dark:text-white">{payment.date}</TableCell>
                      <TableCell className="text-right text-black dark:text-white">${payment.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">Future Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-black dark:text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 dark:text-gray-400">Date</TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentSchedule.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-black dark:text-white">{payment.date}</TableCell>
                      <TableCell className="text-right text-black dark:text-white">${payment.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
