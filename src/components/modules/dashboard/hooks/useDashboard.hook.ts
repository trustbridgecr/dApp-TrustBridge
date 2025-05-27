"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  totalAmount: number;
  availableBalance: number;
  pendingApprovals: number;
  completedLoans: number;
}

interface RecentActivity {
  id: string;
  type:
    | "loan_created"
    | "loan_approved"
    | "milestone_completed"
    | "payment_received"
    | "loan_completed";
  title: string;
  description: string;
  amount?: number;
  date: Date;
  status?: "pending" | "completed" | "rejected";
}

interface LoanData {
  month: string;
  amount: number;
}

interface UpcomingMilestone {
  id: string;
  loanTitle: string;
  description: string;
  dueDate: Date;
  amount: number;
}

export function useDashboard() {
  const { walletAddress: address } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    activeLoans: 0,
    totalAmount: 0,
    availableBalance: 0,
    pendingApprovals: 0,
    completedLoans: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loanTrends, setLoanTrends] = useState<LoanData[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<
    UpcomingMilestone[]
  >([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      setTimeout(() => {
        setStats({
          totalLoans: 24,
          activeLoans: 8,
          totalAmount: 125000,
          availableBalance: 42500,
          pendingApprovals: 3,
          completedLoans: 16,
        });

        setRecentActivity([
          {
            id: "1",
            type: "loan_approved",
            title: "Loan Approved",
            description:
              'Your loan offer for "Business Expansion Funding" was approved',
            amount: 15000,
            date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            status: "completed",
          },
          {
            id: "2",
            type: "milestone_completed",
            title: "Milestone Completed",
            description: 'Milestone 2: "Product Development" was completed',
            amount: 5000,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24),
            status: "completed",
          },
          {
            id: "3",
            type: "payment_received",
            title: "Payment Received",
            description: 'You received a payment for "Inventory Financing"',
            amount: 2500,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            status: "completed",
          },
          {
            id: "4",
            type: "loan_created",
            title: "Loan Created",
            description:
              'You created a new loan offer for "Seasonal Inventory"',
            amount: 7500,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            status: "pending",
          },
          {
            id: "5",
            type: "loan_completed",
            title: "Loan Completed",
            description: 'Loan "Working Capital" was fully repaid',
            amount: 10000,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            status: "completed",
          },
        ]);

        setLoanTrends([
          { month: "Jan", amount: 15000 },
          { month: "Feb", amount: 18000 },
          { month: "Mar", amount: 22000 },
          { month: "Apr", amount: 17000 },
          { month: "May", amount: 25000 },
          { month: "Jun", amount: 28000 },
        ]);

        setUpcomingMilestones([
          {
            id: "1",
            loanTitle: "Business Expansion Funding",
            description: "Market Research Completion",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            amount: 3000,
          },
          {
            id: "2",
            loanTitle: "Tech Startup Investment",
            description: "MVP Development",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            amount: 5000,
          },
          {
            id: "3",
            loanTitle: "Inventory Financing",
            description: "Supplier Payment Confirmation",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            amount: 2500,
          },
        ]);

        setLoading(false);
      }, 1500);
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "Just now";
    }
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `In ${diffDays} days`;
    }
  };

  return {
    loading,
    stats,
    recentActivity,
    loanTrends,
    upcomingMilestones,
    formatCurrency,
    formatDate,
    formatDueDate,
    address,
  };
}
