"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export function TotalValueLocked() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$2.45M</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500">↑</span> $230K (10%)
        </p>
      </CardContent>
    </Card>
  )
}

