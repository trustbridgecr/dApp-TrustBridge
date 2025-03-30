"use client";
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { useTranslation } from "react-i18next";

import { CreditCard, DollarSign, Calendar, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";


interface CurrentLoanProps {
  totalAmount: number;
  amountPaid: number;
  nextPayment: string;
  interestRate: number;
  theme: "light" | "dark";
}


export default function CurrentLoanStatus({
  totalAmount,
  amountPaid,
  nextPayment,
  interestRate,
  theme,
}: CurrentLoanProps
) {

  const { t } = useTranslation()

  const progressPercentage = (amountPaid / totalAmount) * 100;

  return (
    <Card className={` border ${theme === "dark" ? "bg-[#0E1827] border-[#0F2535] shadow-[0_4px_12px_rgba(1,242,160,0.15)]" : "bg-white border-gray-200 shadow-md "}`}>
    <CardHeader className='border-b border-gray-700'>
      <CardTitle className="text-lg font-bold flex items-center gap-2">
      <CreditCard className="w-7 h-7 text-[#38bdf8]"/> {t("borrowerDashboard.currentLoan.title")}
      </CardTitle>
      <CardDescription className="text-sm text-gray-300">{t("borrowerDashboard.currentLoan.summary")}</CardDescription>
    </CardHeader>
    <CardContent className="mt-6 space-y-2">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex justify-between items-center gap-6">
            <div className="flex gap-2 items-center text-gray-300"> <DollarSign className="w-4 h-4 text-[#38bdf8]" />{t("borrowerDashboard.currentLoan.totalAmount")}:</div>
            <span className="text-green-400">${totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex gap-2 items-center text-gray-300"><Calendar className="w-4 h-4 text-[#38bdf8]" />{t("borrowerDashboard.currentLoan.nextPayment")}:</div>
            <span className="text-white">{nextPayment}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex gap-2 items-center text-gray-300"><DollarSign className="w-4 h-4 text-[#38bdf8]" />{t("borrowerDashboard.currentLoan.amountPaid")}:</div>
            <span className="text-green-400">${amountPaid.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex gap-2 items-center text-gray-300"><Percent className="w-4 h-4 text-[#38bdf8]" />{t("borrowerDashboard.currentLoan.interestRate")}:</div>
            <span className="text-white">{interestRate}%</span>
          </div>
    </div>
     

      {/* Loan Progress Bar */}
      <Progress value={progressPercentage} className="h-2 bg-gray-700" />
      <div className="flex justify-between text-xs text-gray-400 mt-3">
        <div>${amountPaid.toFixed(2)} {t("borrowerDashboard.currentLoan.percentagePaid")}</div>
        <div className="text-green-400 bg-[#12533d] py-1 px-3 rounded-xl">{progressPercentage.toFixed(1)}% {t("borrowerDashboard.currentLoan.completed")}</div>
        <div>${(totalAmount - amountPaid).toFixed(2)} {t("borrowerDashboard.currentLoan.remaining")}</div>
      </div>
    </CardContent>
  </Card>
  )
}
