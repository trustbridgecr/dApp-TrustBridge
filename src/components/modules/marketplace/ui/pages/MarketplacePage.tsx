"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoanOffer {
  id: number;
  lender: string;
  amount: number;
  interestRate: number;
  termMonths: number;
}

const sampleLoans: LoanOffer[] = [
  { id: 1, lender: "Alice", amount: 500, interestRate: 5, termMonths: 6 },
  { id: 2, lender: "Bob", amount: 1000, interestRate: 7, termMonths: 12 },
  { id: 3, lender: "Charlie", amount: 750, interestRate: 6, termMonths: 9 },
];

export function MarketplacePage() {
  const [loans, setLoans] = useState<LoanOffer[]>(sampleLoans);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [term, setTerm] = useState("");

  const addLoan = () => {
    if (!amount || !interest || !term) return;
    const newLoan: LoanOffer = {
      id: loans.length + 1,
      lender: "You",
      amount: Number(amount),
      interestRate: Number(interest),
      termMonths: Number(term),
    };
    setLoans([...loans, newLoan]);
    setAmount("");
    setInterest("");
    setTerm("");
    setShowForm(false);
  };

  return (
    <div className="space-y-8 p-4">
      <Card className="shadow-none border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Marketplace</CardTitle>
          <CardDescription>
            Browse available loan offers or create your own.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Offer a Loan"}
            </Button>
          </div>
          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="interest">Interest %</Label>
                <Input
                  id="interest"
                  placeholder="Interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="term">Term (months)</Label>
                <Input
                  id="term"
                  placeholder="Term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button onClick={addLoan}>Submit</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loans.map((loan) => (
              <Card key={loan.id} className="shadow-sm hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Lender: {loan.lender}
                  </CardTitle>
                  <CardDescription>
                    {loan.amount} USDC &middot; {loan.interestRate}% for{" "}
                    {loan.termMonths} months
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button size="sm">Request</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
