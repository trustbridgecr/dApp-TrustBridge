"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeMilestoneFlagForm } from "../../hooks/change-milestone-flag-form.hook";
import { useEscrowContext } from "@/providers/escrow.provider";
import { ResponseDisplay } from "@/utils/response-display";

export function ChangeMilestoneFlagForm() {
  const { form, milestones, loading, response, onSubmit } =
    useChangeMilestoneFlagForm();
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
            name="approver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approver Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="GSERVICE..."
                    {...field}
                    disabled={!!escrow?.roles.approver}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="milestoneIndex"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Milestone Index</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a milestone" />
                    </SelectTrigger>
                    <SelectContent>
                      {milestones.map((_, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Milestone {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newFlag"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Approve Milestone</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    disabled={true}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Change Milestone Flag"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay response={response} />
    </div>
  );
}
