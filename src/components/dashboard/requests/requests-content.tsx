"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Loan amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Loan amount must be a positive number",
    }),
  term: z.string().min(1, "Loan term is required"),
  purpose: z
    .string()
    .min(10, "Purpose must have at least 10 characters")
    .max(500, "Purpose cannot exceed 500 characters"),
  monthlyIncome: z
    .string()
    .min(1, "Monthly income is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Monthly income must be a positive number",
    }),
});

export function RequestsContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      term: "",
      purpose: "",
      monthlyIncome: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated submission
      // Removed toast notification
    } catch (error) {
      // Removed toast notification
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#18181B] text-black dark:text-white p-6">
      <Card className="w-full max-w-lg bg-white dark:bg-[#18181B] border border-gray-200 dark:border-none">
        <h2 className="text-4xl font-bold text-left mb-6">Request Loan</h2>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black dark:text-white">Request a Loan</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Complete the form to request your loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g.: 5000" {...field} />
                    </FormControl>
                    <FormDescription>Enter the amount you wish to request in USD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the repayment period</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Loan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe why you need the loan"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Explain the reason for your request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g.: 3000" {...field} />
                    </FormControl>
                    <FormDescription>Enter your average monthly income in USD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary text-white dark:bg-blue-700 hover:dark:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
