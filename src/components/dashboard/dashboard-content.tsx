"use client";

import "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { t, i18n } = useTranslation();
  const percentagePaid = (currentLoan.paid / currentLoan.amount) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="flex-1 p-6 bg-white dark:bg-[#18181B] text-black dark:text-white">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-left">
            {t("dashboard.title")}
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">
                {t("dashboard.currentLoan.title")}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("dashboard.currentLoan.summary")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.currentLoan.totalAmount")}:
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {formatCurrency(currentLoan.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.currentLoan.amountPaid")}:
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {formatCurrency(currentLoan.paid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.currentLoan.nextPayment")}:
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {formatDate(currentLoan.nextPaymentDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.currentLoan.interestRate")}:
                    </span>
                    <span className="font-medium text-black dark:text-white">
                      {currentLoan.interestRate}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress
                    value={percentagePaid}
                    className="h-2 bg-gray-200 dark:bg-gray-700"
                  />
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                    {percentagePaid.toFixed(1)}%{" "}
                    {t("dashboard.currentLoan.percentagePaid")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">
                {t("dashboard.paymentHistory.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.paymentHistory.date")}
                    </TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">
                      {t("dashboard.paymentHistory.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-black dark:text-white">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-right text-black dark:text-white">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-black dark:text-white">
                {t("dashboard.paymentSchedule.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 dark:text-gray-400">
                      {t("dashboard.paymentSchedule.date")}
                    </TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">
                      {t("dashboard.paymentSchedule.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentSchedule.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-black dark:text-white">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-right text-black dark:text-white">
                        {formatCurrency(payment.amount)}
                      </TableCell>
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
