"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
  Wallet,
  PiggyBank,
  Activity,
  Landmark,
  FileText,
  Milestone,
  BarChart4,
  CircleDollarSign,
  BadgeCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard.hook";

export function DashboardOverview() {
  const {
    loading,
    stats,
    recentActivity,
    loanTrends,
    formatCurrency,
    formatDate,
  } = useDashboard();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "loan_created":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "loan_approved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "milestone_completed":
        return <Milestone className="h-4 w-4 text-purple-500" />;
      case "payment_received":
        return <DollarSign className="h-4 w-4 text-amber-500" />;
      case "loan_completed":
        return <BadgeCheck className="h-4 w-4 text-teal-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 pb-32">
        <Skeleton className="h-8 w-64 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-muted-foreground pl-3 border-l-2 border-muted">
          Welcome back! Here's an overview of your loan activity and financial
          status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <CardDescription>Total Loan Volume</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(stats.totalAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-emerald-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% from last month</span>
              </div>
              <span className="text-muted-foreground">
                {stats.totalLoans} loans
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
          <CardHeader className="pb-2">
            <CardDescription>Active Loans</CardDescription>
            <CardTitle className="text-2xl">{stats.activeLoans}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-teal-600">
                <CreditCard className="h-4 w-4 mr-1" />
                <span>{formatCurrency(stats.totalAmount * 0.4)}</span>
              </div>
              <span className="text-muted-foreground">In progress</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(stats.availableBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-emerald-600">
                <Wallet className="h-4 w-4 mr-1" />
                <span>Available to withdraw</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
          <CardHeader className="pb-2">
            <CardDescription>Pending Approvals</CardDescription>
            <CardTitle className="text-2xl">{stats.pendingApprovals}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-teal-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Awaiting review</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Tabs defaultValue="earnings" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/80">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="loans"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
              >
                Loans
              </TabsTrigger>
              <TabsTrigger
                value="earnings"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
              >
                Earnings
              </TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <BarChart4 className="h-3.5 w-3.5" />
              <span>Reports</span>
            </Button>
          </div>

          <Card className="border-border shadow-sm">
            <TabsContent value="overview" className="m-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Financial Overview</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      Loans
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-teal-500" />
                      Repayments
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-[300px] mt-4 flex items-end justify-between gap-2">
                  {loanTrends.map((data, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 w-full"
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-[250px]">
                        <div
                          className="w-3 bg-emerald-500 rounded-t-sm"
                          style={{
                            height: `${(data.amount / 30000) * 100}%`,
                          }}
                        />
                        <div
                          className="w-3 bg-teal-500 rounded-t-sm"
                          style={{
                            height: `${((data.amount * 0.7) / 30000) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="loans" className="m-0">
              <CardHeader>
                <CardTitle>Loan Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        Active Loans
                      </span>
                      <span className="font-medium">
                        {stats.activeLoans} (
                        {((stats.activeLoans / stats.totalLoans) * 100).toFixed(
                          0,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(stats.activeLoans / stats.totalLoans) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-teal-500" />
                        Pending Loans
                      </span>
                      <span className="font-medium">
                        {stats.pendingApprovals} (
                        {(
                          (stats.pendingApprovals / stats.totalLoans) *
                          100
                        ).toFixed(0)}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(stats.pendingApprovals / stats.totalLoans) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                        Completed Loans
                      </span>
                      <span className="font-medium">
                        {stats.completedLoans} (
                        {(
                          (stats.completedLoans / stats.totalLoans) *
                          100
                        ).toFixed(0)}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(stats.completedLoans / stats.totalLoans) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="pt-4 mt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Total Loans
                        </span>
                        <p className="text-xl font-bold">{stats.totalLoans}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Avg. Amount
                        </span>
                        <p className="text-xl font-bold">
                          {formatCurrency(stats.totalAmount / stats.totalLoans)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Success Rate
                        </span>
                        <p className="text-xl font-bold text-emerald-600">
                          94%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="earnings" className="m-0">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 rounded-full p-2">
                            <CircleDollarSign className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total Earnings
                            </p>
                            <p className="text-lg font-bold">
                              {formatCurrency(stats.totalAmount * 0.12)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-100 dark:border-teal-900/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-teal-100 rounded-full p-2">
                            <PiggyBank className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Interest Earned
                            </p>
                            <p className="text-lg font-bold">
                              {formatCurrency(stats.totalAmount * 0.08)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Earnings Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-emerald-600" />
                          Interest Income
                        </span>
                        <span className="font-medium">
                          {formatCurrency(stats.totalAmount * 0.08)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-teal-600" />
                          Platform Fees
                        </span>
                        <span className="font-medium">
                          {formatCurrency(stats.totalAmount * 0.03)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-emerald-600" />
                          Milestone Bonuses
                        </span>
                        <span className="font-medium">
                          {formatCurrency(stats.totalAmount * 0.01)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-muted rounded-full p-1.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatDate(activity.date)}
                      </span>
                      {activity.amount && (
                        <span className="font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs justify-between text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                View All Activity
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
