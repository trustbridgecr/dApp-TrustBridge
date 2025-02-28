"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoanSummaryProps {
  totalAmount: number;
  amountPaid: number;
  interestRate: number;
  nextPaymentDate: string;
}

export function LoanSummary({ totalAmount, amountPaid, interestRate, nextPaymentDate }: LoanSummaryProps) {
  const { t } = useTranslation();
  const percentage = (amountPaid / totalAmount) * 100;

  return (
    <Card className="w-full dark:border-gray-700 dark:bg-darkbg">
      <CardHeader>
        <CardTitle>{t("loanSummary.title")}</CardTitle>
        <CardDescription>{t("loanSummary.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">{t("loanSummary.totalAmount")}:</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("loanSummary.amountPaid")}:</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountPaid)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("loanSummary.nextPayment")}:</p>
            <p className="text-lg">{nextPaymentDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("loanSummary.interestRate")}:</p>
            <p className="text-lg">{interestRate}%</p>
          </div>
        </div>
        <div className="w-full">
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-sm text-muted-foreground text-right mt-2">
            {percentage.toFixed(1)}% {t("loanSummary.percentagePaid")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
