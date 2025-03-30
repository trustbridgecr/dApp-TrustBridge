"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  Dot,
  ExternalLink,
  Percent,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanDetailsProps {
  totalAmount: number;
  amountPaid: number;
  interestRate: number;
  nextPayment: string;
  paymentHistory: Array<{ date: string; amount: number }>;
  upcomingPayments: Array<{ dueDate: string; amount: number }>;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({
  totalAmount,
  amountPaid,
  interestRate,
  nextPayment,
  paymentHistory,
  upcomingPayments,
}) => {
  const { t } = useTranslation();
  const completionPercentage = (amountPaid / totalAmount) * 100;
  const remainingAmount = totalAmount - amountPaid;

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-6 md:py-8 min-h-screen",
        "bg-white dark:bg-gradient-to-br dark:from-[#131620] dark:to-[#19181A]",
        "text-black dark:text-white"
      )}
    >
      {/* Flex Header with Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
            {t("loanDetails.title")}
          </h1>

          <div className="flex flex-col gap-[3px] mt-2">
            <div className="h-[3px] max-w-[120px] sm:max-w-[160px] bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
            <div className="h-[2px] max-w-20 sm:max-w-28 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div
          className="rounded-full w-fit py-1.5 px-3 sm:py-2 sm:px-4 flex justify-center items-center gap-2 sm:gap-3  
    dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 
    shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] 
    hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.25)] transition-all duration-300"
        >
          <div className="h-2 w-2 sm:w-4 sm:h-4 bg-[#63CDE6] rounded-full animate-pulse"></div>
          <div>
            <p className="dark:text-green-100 text-xs sm:text-sm">
              {t("loanDetails.activeLoan")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Loan Summary */}
        <div className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300">
          <div className="pb-4 border-b dark:border-[#63CDE6]/20">
            <div>
              <h2
                className={cn(
                  "text-lg sm:text-xl font-semibold text-black",
                  "dark:text-white",
                  "flex items-center"
                )}
              >
                <CreditCard className="text-[#5de0f7] mr-2" size={20} />
                {t("loanDetails.loanSummary.title")}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-400 dark:text-gray-400">
                {t("loanDetails.loanSummary.subtitle")}
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <CreditCard className="text-[#63CDE6] mr-2" size={18} />
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                      {t("loanDetails.loanSummary.totalAmount")}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-black dark:text-green-300">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <Calendar className="text-[#63CDE6]" size={18} />
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                      {t("loanDetails.loanSummary.nextPayment")}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-black dark:text-white">
                    {nextPayment}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <DollarSign className="text-[#63CDE6]" size={18} />
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                      {t("loanDetails.loanSummary.amountPaid")}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-black dark:text-green-300">
                    ${amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <Percent className="text-[#5de0f7]" size={18} />
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                      {t("loanDetails.loanSummary.interestRate")}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-black dark:text-white">
                    {interestRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2F92D2] to-[#1AAA9F] rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-white/50 mt-2">
                  <span>
                    ${amountPaid.toLocaleString()}{" "}
                    {t("loanDetails.loanSummary.completed")}
                  </span>
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 w-fit bg-green-500/20 text-green-300">
                    {completionPercentage.toFixed(0)}.0%{" "}
                    {t("loanDetails.loanSummary.completed")}
                  </span>
                  <span>
                    {completionPercentage.toFixed(0)}%{" "}
                    {t("loanDetails.loanSummary.completed")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300">
          <div className="pb-4 border-b dark:border-[#63CDE6]/20">
            <h2
              className={cn(
                "text-lg sm:text-xl font-semibold text-black",
                "dark:text-white",
                " flex items-center"
              )}
            >
              <History
                className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200 mr-2"
                size={20}
              />{" "}
              {t("loanDetails.paymentHistory.title")}
            </h2>
          </div>
          <div className="pt-4 overflow-x-auto">
            <table className="w-full">
              <thead
                className={cn(
                  "border-b border-black/10",
                  "dark:border-white/10"
                )}
              >
                <tr>
                  <th
                    className={cn(
                      "pb-2 text-left text-xs sm:text-sm text-black/60",
                      "dark:text-[#63CDE6] "
                    )}
                  >
                    {t("loanDetails.upcomingPayments.dueDate")}
                  </th>
                  <th
                    className={cn(
                      "pb-2 text-right text-xs sm:text-sm text-black/60",
                      "dark:text-[#63CDE6] "
                    )}
                  >
                    {t("loanDetails.upcomingPayments.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "border-t border-black/10 hover:bg-black/5",
                      "dark:border-gray-700 dark:hover:bg-white/5",
                      "transition-colors"
                    )}
                  >
                    <td className="py-2 sm:py-3 flex items-center">
                      <CheckCircle2 className="mr-2 text-green-300" size={16} />
                      <span className="text-xs sm:text-base text-black dark:text-white">
                        {payment.date}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 text-right text-xs sm:text-base text-black font-semibold dark:text-green-300">
                      ${payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Payments Table */}
      <div className="dark:bg-[#0F1927] border dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)] rounded-2xl p-4 md:p-5 w-full hover:shadow-[0px_0px_12px_4px_rgba(99,205,230,0.20)] transition-all duration-300 mt-4 md:mt-6">
        <div className="pb-4 border-b dark:border-[#63CDE6]/20">
          <h2
            className={cn(
              "text-lg sm:text-xl font-semibold text-black",
              "dark:text-white",
              " flex items-center"
            )}
          >
            <History
              className="text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200 mr-2"
              size={20}
            />
            {t("loanDetails.upcomingPayments.title")}
          </h2>
        </div>
        <div className="w-full overflow-x-auto pt-4">
          <table className="w-full text-left">
            <thead
              className={cn("border-b border-black/10", "dark:border-white/10")}
            >
              <tr>
                <th
                  className={cn(
                    "pb-3 text-xs sm:text-sm text-black/60",
                    "dark:text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200"
                  )}
                >
                  {t("loanDetails.upcomingPayments.dueDate")}
                </th>
                <th
                  className={cn(
                    "pb-3 text-right text-xs sm:text-sm text-black/60",
                    "dark:text-[#63CDE6] hover:text-[#8CDBEE] transition-colors duration-200"
                  )}
                >
                  {t("loanDetails.upcomingPayments.amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map((payment, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-black/10 last:border-b-0 hover:bg-black/5",
                    "dark:border-gray-700 dark:hover:bg-white/5",
                    "transition-colors"
                  )}
                >
                  <td className="py-2 sm:py-3 flex items-center">
                    <Calendar size={16} className="mr-2 dark:text-gray-400" />
                    <span className="text-xs sm:text-base">
                      {payment.dueDate}
                    </span>
                  </td>

                  <td className="py-2 sm:py-3 text-right text-xs sm:text-base font-semibold">
                    ${payment.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
