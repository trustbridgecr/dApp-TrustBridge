"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useGetEscrowForm } from "../../hooks/get-escrow-form.hook";
import { ResponseDisplay } from "@/utils/response-display";

export function GetEscrowForm() {
  const { form, loading, response, onSubmit } = useGetEscrowForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract / Escrow ID</FormLabel>
              <FormControl>
                <Input placeholder="CAZ6UQX7..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signer Address</FormLabel>
              <FormControl>
                <Input disabled placeholder="GSIGN...XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Getting Escrow..." : "Get Escrow"}
        </Button>
      </form>

      <ResponseDisplay response={response} />
    </Form>
  );
}
