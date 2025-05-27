"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResolveDisputeForm } from "../../hooks/resolve-dispute-form.hook";
import { useEscrowContext } from "@/providers/escrow.provider";
import { ResponseDisplay } from "@/utils/response-display";

export function ResolveDisputeForm() {
  const { form, loading, response, onSubmit } = useResolveDisputeForm();
  const { escrow } = useEscrowContext();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract / Escrow ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CAZ6UQX7..."
                    {...field}
                    disabled={!!escrow?.contractId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disputeResolver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispute Resolver Address</FormLabel>
                <FormControl>
                  <Input disabled placeholder="GDISPUTE...XYZ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="approverFunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approver Funds</FormLabel>
                  <FormControl>
                    <Input placeholder="300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverFunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver Funds</FormLabel>
                  <FormControl>
                    <Input placeholder="700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resolving..." : "Resolve Dispute"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay response={response} />
    </div>
  );
}
