"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LoanSummaryProps {
  totalAmount: number
  amountPaid: number
  interestRate: number
  nextPaymentDate: string
}

export function LoanSummary({ totalAmount, amountPaid, interestRate, nextPaymentDate }: LoanSummaryProps) {
  const percentage = (amountPaid / totalAmount) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Loan Status</CardTitle>
        <CardDescription>Summary of your active loan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total amount:</p>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount paid:</p>
            <p className="text-2xl font-bold">${amountPaid.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next payment:</p>
            <p className="text-lg">{nextPaymentDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest rate:</p>
            <p className="text-lg">{interestRate}%</p>
          </div>
        </div>
        <div className="w-full">
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-sm text-muted-foreground text-right mt-2">{percentage.toFixed(1)}% paid</p>
        </div>
      </CardContent>
    </Card>
  )
}

