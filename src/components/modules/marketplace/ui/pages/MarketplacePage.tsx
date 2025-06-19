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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-32">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-emerald-800 to-teal-500 rounded-full" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Marketplace
          </h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground pl-2 md:pl-3 border-l-2 border-muted">
          Discover loan opportunities or offer your own. Connect with borrowers
          and lenders in our secure marketplace.
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg md:text-xl">Loan Offers</CardTitle>
              <CardDescription className="text-sm">
                Browse available loan offers or create your own to attract
                borrowers.
              </CardDescription>
            </div>
            <Button
              onClick={toggleForm}
              className="bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "Offer Loan"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loan Creation Form */}
          {showForm && (
            <Card className="bg-gradient-to-br from-emerald-800 to-teal-50 dark:from-emerald-800 dark:to-teal-950/30 border-emerald-800 dark:border-emerald-800 mx-4 md:mx-0">
              <CardHeader className="pb-3 px-4 md:px-6">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Plus className="h-4 md:h-5 w-4 md:w-5 text-emerald-800" />
                  Create Loan Offer
                </CardTitle>
                <CardDescription className="text-sm">
                  Set your terms and attract potential borrowers to your offer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="amount"
                      className="flex items-center gap-2 text-sm"
                    >
                      <DollarSign className="h-4 w-4" />
                      Loan Amount
                    </Label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white dark:bg-gray-950 h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="interest"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Percent className="h-4 w-4" />
                        Interest (%)
                      </Label>
                      <Input
                        id="interest"
                        placeholder="Rate"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="bg-white dark:bg-gray-950 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="term"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Calendar className="h-4 w-4" />
                        Term (mo)
                      </Label>
                      <Input
                        id="term"
                        placeholder="Months"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="bg-white dark:bg-gray-950 h-11"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={addLoan}
                    className="bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white w-full sm:w-auto"
                  >
                    Create Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loan Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 md:px-0">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className="overflow-hidden border-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="h-1 bg-gradient-to-r from-emerald-800 to-teal-400" />
                <CardHeader className="pb-3 px-4 md:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-800" />
                      {loan.lender}
                    </CardTitle>
                    {getStatusBadge(loan.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl md:text-2xl font-bold text-emerald-800">
                        {formatCurrency(loan.amount)}
                      </span>
                      <span className="text-base md:text-lg font-semibold text-teal-600">
                        {loan.interestRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {loan.termMonths}mo
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {loan.createdAt}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-4 md:px-6">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Monthly:{" "}
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
                        Total:{" "}
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
                      className="w-full bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white gap-2 h-9"
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
            <div className="text-center py-8 md:py-12 px-4">
              <div className="bg-muted rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <DollarSign className="h-6 md:h-8 w-6 md:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">
                No loan offers yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                Be the first to create a loan offer in the marketplace.
              </p>
              <Button
                onClick={() => toggleForm()}
                className="bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white w-full sm:w-auto"
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
