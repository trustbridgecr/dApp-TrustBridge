"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  DollarSign,
  Calendar,
  Percent,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "../../hooks/marketplace.hook";

export function MarketplacePage() {
  const {
    loans,
    showForm,
    amount,
    interest,
    term,
    addLoan,
    toggleForm,
    setAmount,
    setInterest,
    setTerm,
    getStatusInfo,
    formatCurrency,
    calculateMonthlyPayment,
    calculateTotalRepayment,
  } = useMarketplace();

  const getStatusBadge = (status?: string) => {
    const statusInfo = getStatusInfo(status);
    if (!statusInfo) return null;

    return (
      <Badge variant={statusInfo.variant} className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        </div>
        <p className="text-muted-foreground pl-3 border-l-2 border-muted">
          Discover loan opportunities or offer your own. Connect with borrowers
          and lenders in our secure marketplace.
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Loan Offers</CardTitle>
              <CardDescription>
                Browse available loan offers or create your own to attract
                borrowers.
              </CardDescription>
            </div>
            <Button
              onClick={toggleForm}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "Offer Loan"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loan Creation Form */}
          {showForm && (
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  Create Loan Offer
                </CardTitle>
                <CardDescription>
                  Set your terms and attract potential borrowers to your offer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Loan Amount
                    </Label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="interest"
                      className="flex items-center gap-2"
                    >
                      <Percent className="h-4 w-4" />
                      Interest Rate (%)
                    </Label>
                    <Input
                      id="interest"
                      placeholder="Enter rate"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Term (months)
                    </Label>
                    <Input
                      id="term"
                      placeholder="Enter term"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={addLoan}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                  >
                    Create Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loan Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className="overflow-hidden border-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      {loan.lender}
                    </CardTitle>
                    {getStatusBadge(loan.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(loan.amount)}
                      </span>
                      <span className="text-lg font-semibold text-teal-600">
                        {loan.interestRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {loan.termMonths} months
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {loan.createdAt}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Monthly payment:{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(
                            calculateMonthlyPayment(
                              loan.amount,
                              loan.interestRate,
                              loan.termMonths,
                            ),
                          )}
                        </span>
                      </p>
                      <p>
                        Total repayment:{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(
                            calculateTotalRepayment(
                              loan.amount,
                              loan.interestRate,
                            ),
                          )}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
                      disabled={loan.status !== "available"}
                    >
                      {loan.status === "available" ? (
                        <>
                          Request Loan
                          <ArrowRight className="h-3 w-3" />
                        </>
                      ) : loan.status === "pending" ? (
                        "Under Review"
                      ) : (
                        "Funded"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loans.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No loan offers yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a loan offer in the marketplace.
              </p>
              <Button
                onClick={() => toggleForm()}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
              >
                Create First Offer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
