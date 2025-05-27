"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useGetMultipleEscrowBalancesForm } from "../../hooks/get-multiple-escrow-balances-form.hook";
import { ResponseDisplay } from "@/utils/response-display";

export function GetMultipleEscrowBalanceForm() {
  const { form, loading, response, fields, append, remove, onSubmit } =
    useGetMultipleEscrowBalancesForm();

  return (
    <div className="w-full md:w-3/4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Signer Address */}
          <FormField
            control={form.control}
            name="signer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signer Address</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contract Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Contract / Escrow Addresses</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder={`Contract / Escrow Address ${index + 1}`}
                        {...field}
                      />
                    </FormControl>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Fetching..." : "Get Balances"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay response={response} />
    </div>
  );
}
