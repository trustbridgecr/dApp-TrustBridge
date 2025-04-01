"use client";

import {
  Search,
  Trash2,
  Plus,
  HelpCircle,
  BarChart4,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function LoanDashboard() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Loans</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>FAQ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="my-loans" className="mb-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="my-loans">Initiated Loans</TabsTrigger>
          <TabsTrigger value="approver">Approver</TabsTrigger>
          <TabsTrigger value="service-provider">Service Provider</TabsTrigger>
          <TabsTrigger value="dispute-resolver">Dispute Resolver</TabsTrigger>
          <TabsTrigger value="release-signer">Release Signer</TabsTrigger>
          <TabsTrigger value="platform-address">Platform Address</TabsTrigger>
        </TabsList>

        <TabsContent value="my-loans" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search loans..." className="pl-10" />
                  </div>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Link href="./loans/create-loan">
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white ">
                    <Plus className="mr-2 h-4 w-4" /> Create Loan
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium mb-2">Filter by Status</p>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="defaulted">Defaulted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Filter by Amount</p>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Amounts</SelectItem>
                      <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                      <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">
                        $5,000 - $10,000
                      </SelectItem>
                      <SelectItem value="10000+">$10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LoanCard
                  id="LN7842KCIU"
                  amount={15000}
                  paid={3750}
                  status="Active"
                  completion={25}
                  date="29/03/2025"
                />

                <LoanCard
                  id="LN5621ABXZ"
                  amount={5000}
                  paid={5000}
                  status="Completed"
                  completion={100}
                  date="15/02/2025"
                />

                <LoanCard
                  id="LN9384PQRS"
                  amount={8000}
                  paid={0}
                  status="Pending"
                  completion={0}
                  date="01/04/2025"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approver">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No loans pending approval found.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-provider">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No service provider loans found.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute-resolver">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No disputed loans found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="release-signer">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No loans pending release signature found.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform-address">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No platform address loans found.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LoanCardProps {
  id: string;
  amount: number;
  paid: number;
  status: "Active" | "Pending" | "Completed" | "Defaulted";
  completion: number;
  date: string;
}

function LoanCard({
  id,
  amount,
  paid,
  status,
  completion,
  date,
}: LoanCardProps) {
  const statusVariants = {
    Active: "default",
    Pending: "outline",
    Completed: "secondary",
    Defaulted: "destructive",
  } as const;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{id}</span>
          </div>
          <Badge variant={statusVariants[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold">${paid.toLocaleString()}</span>
          <span className="text-muted-foreground">of</span>
          <span className="text-xl font-semibold">
            ${amount.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Repayment Progress</span>
            <span>{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <span>Created: {date}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <BarChart4 className="h-3.5 w-3.5 mr-1" />
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
