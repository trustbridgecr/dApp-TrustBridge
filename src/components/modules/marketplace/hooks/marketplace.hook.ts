"use client";

import { useState } from "react";

export interface LoanOffer {
  id: number;
  lender: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  status?: "available" | "pending" | "funded";
  createdAt?: string;
}

const sampleLoans: LoanOffer[] = [
  {
    id: 1,
    lender: "Alice",
    amount: 500,
    interestRate: 5,
    termMonths: 6,
    status: "available",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    lender: "Bob",
    amount: 1000,
    interestRate: 7,
    termMonths: 12,
    status: "available",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    lender: "Charlie",
    amount: 750,
    interestRate: 6,
    termMonths: 9,
    status: "pending",
    createdAt: "2024-01-13",
  },
];

export function useMarketplace() {
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
      status: "available",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLoans([...loans, newLoan]);
    setAmount("");
    setInterest("");
    setTerm("");
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          variant: "outline" as const,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "pending":
        return {
          label: "Pending",
          variant: "outline" as const,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "funded":
        return {
          label: "Funded",
          variant: "outline" as const,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateMonthlyPayment = (
    amount: number,
    interestRate: number,
    termMonths: number,
  ) => {
    return (amount * (1 + interestRate / 100)) / termMonths;
  };

  const calculateTotalRepayment = (amount: number, interestRate: number) => {
    return amount * (1 + interestRate / 100);
  };

  // Computed values
  const availableLoans = loans.filter((loan) => loan.status === "available");
  const totalVolume = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const avgInterest =
    loans.length > 0
      ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length
      : 0;

  const stats = {
    totalVolume,
    availableLoans: availableLoans.length,
    avgInterest,
    totalOffers: loans.length,
    availableVolume: availableLoans.reduce((sum, loan) => sum + loan.amount, 0),
  };

  return {
    // State
    loans,
    showForm,
    amount,
    interest,
    term,

    // Actions
    addLoan,
    toggleForm,
    setAmount,
    setInterest,
    setTerm,

    // Utilities
    getStatusInfo, // Cambiar de getStatusBadge a getStatusInfo
    formatCurrency,
    calculateMonthlyPayment,
    calculateTotalRepayment,

    // Computed values
    availableLoans,
    stats,
  };
}
