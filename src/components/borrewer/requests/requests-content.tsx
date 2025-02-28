"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function RequestsContent() {
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-darkbg text-black dark:text-white p-6">
      <Card className="w-full max-w-lg bg-white dark:bg-darkbg border border-gray-200 dark:border-none">
        <h2 className="text-4xl font-bold text-left mb-6">
          {t("form.pageTitle")}
        </h2>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black dark:text-white">
            {t("form.title")}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t("form.description")}
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
                    <FormLabel>{t("form.fields.amount.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fields.amount.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.fields.amount.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fields.term.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("form.fields.term.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanTerms.map((term) => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("form.fields.term.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fields.purpose.label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.fields.purpose.placeholder")}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.fields.purpose.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.fields.monthlyIncome.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fields.monthlyIncome.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.fields.monthlyIncome.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("form.buttons.submitting")
                  : t("form.buttons.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
