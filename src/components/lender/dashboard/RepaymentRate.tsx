"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function RepaymentRate() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Repayment Rate</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">98.5%</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500">↑</span> 0.5%
        </p>
      </CardContent>
    </Card>
  )
}

