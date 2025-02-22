"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const requests = [
  {
    name: "Alice Johnson",
    amount: "$5,000",
    status: "Pending",
  },
  {
    name: "Bob Smith",
    amount: "$3,500",
    status: "Pending",
  },
  {
    name: "Carol Williams",
    amount: "$7,000",
    status: "Pending",
  },
]

export function RecentLoanRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Loan Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">You have 3 loan requests to review.</p>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.name} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{request.name}</p>
                <p className="text-sm text-muted-foreground">Amount: {request.amount}</p>
              </div>
              <Badge variant="outline">{request.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

