"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Loader2,
} from "lucide-react";

// Mock translation function since we don't have react-i18next
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "form.pageTitle": "Loan Request",
        "form.title": "Apply for a Loan",
        "form.description":
          "Fill out the form below to request a loan. We'll review your application and get back to you shortly.",
        "form.fields.amount.label": "Loan Amount",
        "form.fields.amount.placeholder": "Enter amount (e.g. 5000)",
        "form.fields.amount.description": "How much would you like to borrow?",
        "form.fields.term.label": "Loan Term",
        "form.fields.term.placeholder": "Select loan term",
        "form.fields.term.description":
          "How long do you need to repay the loan?",
        "form.fields.purpose.label": "Loan Purpose",
        "form.fields.purpose.placeholder": "Describe why you need this loan...",
        "form.fields.purpose.description":
          "Please provide details about how you plan to use the funds.",
        "form.fields.monthlyIncome.label": "Monthly Income",
        "form.fields.monthlyIncome.placeholder": "Enter your monthly income",
        "form.fields.monthlyIncome.description":
          "Your gross monthly income before taxes.",
        "form.buttons.submit": "Submit Application",
        "form.buttons.submitting": "Submitting...",
        "form.validation.amount.required": "Loan amount is required",
        "form.validation.amount.positive": "Amount must be a positive number",
        "form.validation.term.required": "Loan term is required",
        "form.validation.purpose.minLength":
          "Purpose must be at least 10 characters",
        "form.validation.purpose.maxLength":
          "Purpose cannot exceed 500 characters",
        "form.validation.income.required": "Monthly income is required",
        "form.validation.income.positive": "Income must be a positive number",
        "form.terms.3months": "3 months",
        "form.terms.6months": "6 months",
        "form.terms.12months": "12 months",
        "form.terms.18months": "18 months",
        "form.terms.24months": "24 months",
      };
      return translations[key] || key;
    },
  };
};

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "form.validation.amount.required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "form.validation.amount.positive",
    }),
  term: z.string().min(1, "form.validation.term.required"),
  purpose: z
    .string()
    .min(10, "form.validation.purpose.minLength")
    .max(500, "form.validation.purpose.maxLength"),
  monthlyIncome: z
    .string()
    .min(1, "form.validation.income.required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "form.validation.income.positive",
    }),
});

export function LoanRequestForm() {
  const { t } = useTranslation();
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const loanTerms = [
    { value: "3", label: t("form.terms.3months") },
    { value: "6", label: t("form.terms.6months") },
    { value: "12", label: t("form.terms.12months") },
    { value: "18", label: t("form.terms.18months") },
    { value: "24", label: t("form.terms.24months") },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="backdrop-blur-md bg-[#0A1A2A]/60 rounded-2xl border border-cyan-900/30 overflow-hidden shadow-[0_0_15px_rgba(0,200,255,0.1)]">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CreditCard className="text-cyan-400" />
            <h2 className="text-xl font-bold">{t("form.title")}</h2>
          </div>
          <p className="mt-1 text-white/60">{t("form.description")}</p>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <DollarSign className="h-4 w-4 text-cyan-300" />
                      {t("form.fields.amount.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fields.amount.placeholder")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white/60">
                      {t("form.fields.amount.description")}
                    </FormDescription>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4 text-cyan-300" />
                      {t("form.fields.term.label")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/30">
                          <SelectValue
                            placeholder={t("form.fields.term.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0A1A2A] border border-cyan-900/30 text-white">
                        {loanTerms.map((term) => (
                          <SelectItem
                            key={term.value}
                            value={term.value}
                            className="hover:bg-white/5 hover:text-cyan-300 focus:bg-white/5 focus:text-cyan-300"
                          >
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-white/60">
                      {t("form.fields.term.description")}
                    </FormDescription>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <FileText className="h-4 w-4 text-cyan-300" />
                      {t("form.fields.purpose.label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.fields.purpose.placeholder")}
                        className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/30 min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white/60">
                      {t("form.fields.purpose.description")}
                    </FormDescription>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <DollarSign className="h-4 w-4 text-cyan-300" />
                      {t("form.fields.monthlyIncome.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fields.monthlyIncome.placeholder")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white/60">
                      {t("form.fields.monthlyIncome.description")}
                    </FormDescription>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("form.buttons.submitting")}
                  </div>
                ) : (
                  t("form.buttons.submit")
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
