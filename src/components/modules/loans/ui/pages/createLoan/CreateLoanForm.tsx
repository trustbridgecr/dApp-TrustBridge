"use client";

import { InfoIcon as InfoCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateLoanForm } from "../../../hooks/useCreateLoanForm";

export default function CreateLoanForm() {
  const { formData, handleChange, handleSubmit } = useCreateLoanForm();
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Loan</h1>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-2xl">
            Fill in the details of the Loan
          </CardTitle>
          <CardDescription>
            Fill in the details below to set up a secure and reliable loan
            agreement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row: Title | Engagement | Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="title">Title</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter a descriptive title for this loan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="title"
                  placeholder="Loan title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="engagement">Engagement</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unique loan identifier (user-defined)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="engagement"
                  placeholder="e.g. LN-2025-04-01-001"
                  value={formData.engagement}
                  onChange={(e) => handleChange("engagement", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the loan amount</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    $
                  </span>
                  <Input
                    id="amount"
                    placeholder="Enter the loan amount"
                    className="pl-7"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Second Row: Service Provider (2 cols) | Trustline (1 col) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="service-provider">Service Provider</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Wallet address of the borrower</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="service-provider"
                  placeholder="Enter borrower wallet address"
                  value={formData.serviceProvider}
                  onChange={(e) =>
                    handleChange("serviceProvider", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="trustline">Trustline</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the asset or token to use for this loan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  onValueChange={(value) => handleChange("trustline", value)}
                >
                  <SelectTrigger id="trustline" className="w-full">
                    <SelectValue placeholder="Select a Trustline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="xlm">XLM</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-start mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
                size="lg"
              >
                Initialize Loan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
