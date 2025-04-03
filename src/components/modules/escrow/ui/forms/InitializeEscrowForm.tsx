"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useInitializeEscrow } from "@/components/modules/escrow/hooks/initialize-escrow.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import SelectField from "@/components/utils/ui/SelectSearch";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Trash2 } from "lucide-react";
import { useMarketplaceStore } from "@/components/modules/dashboard/marketplace/store/marketplace";

const InitializeEscrowForm = () => {
  const {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleFieldChange,
    userOptions,
    trustlineOptions,
    showSelect,
    toggleField,
    isAnyMilestoneEmpty,
  } = useInitializeEscrow();

  const { selectedLoan, clearSelectedLoan } = useMarketplaceStore();

  useEffect(() => {
    if (selectedLoan) {
      form.setValue("amount", selectedLoan.maxAmount?.toString() || "");
      form.setValue("platformFee", selectedLoan.platformFee?.toString() || "");
      form.setValue("platformAddress", selectedLoan.platformAddress || "");
      form.setValue("approver", selectedLoan.approver || "");
      form.setValue("releaseSigner", selectedLoan.releaseSigner || "");
      form.setValue("disputeResolver", selectedLoan.disputeResolver || "");
      form.setValue("milestones", selectedLoan.milestones || []);
    }

    return () => {
      clearSelectedLoan();
    };
  }, [selectedLoan]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Title<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Significant title for escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Escrow title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("title", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engagementId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Engagement<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Unique identifier for this escrow engagement." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter identifier"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("engagementId", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SelectField
            required
            control={form.control}
            name="trustline"
            label="Trustline"
            tooltipContent="Trustline to be used for the escrow."
            options={trustlineOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="approver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Approver<span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Address of the approver for this escrow." />
                  </span>
                </FormLabel>

                <FormControl>
                  {showSelect.approver ? (
                    <SelectField
                      control={form.control}
                      name="approver"
                      label=""
                      tooltipContent="A"
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-filled approver address"
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Service Provider
                    <span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Address of the service provider for this escrow." />
                  </span>
                </FormLabel>
                <FormControl>
                  {showSelect.serviceProvider ? (
                    <SelectField
                      control={form.control}
                      name="serviceProvider"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter service provider address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("serviceProvider", e.target.value);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="releaseSigner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Release Signer
                    <span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Entity authorized to release funds from escrow." />
                  </span>
                </FormLabel>
                <FormControl>
                  {showSelect.releaseSigner ? (
                    <SelectField
                      control={form.control}
                      name="releaseSigner"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-filled release signer"
                      {...field}
                    />
                  )}
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
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Dispute Resolver
                    <span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Entity responsible for resolving disputes." />
                  </span>
                </FormLabel>
                <FormControl>
                  {showSelect.disputeResolver ? (
                    <SelectField
                      control={form.control}
                      name="disputeResolver"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-filled dispute resolver"
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-5">
            <FormField
              control={form.control}
              name="platformAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Platform Address{" "}
                      <span className="text-destructive ml-1">*</span>
                      <TooltipInfo content="Public key of the platform managing the escrow." />
                    </span>
                  </FormLabel>
                  <FormControl>
                    {showSelect.platformAddress ? (
                      <SelectField
                        control={form.control}
                        name="platformAddress"
                        label=""
                        tooltipContent=""
                        options={userOptions}
                      />
                    ) : (
                      <Input
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                        placeholder="Auto-filled platform address"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="platformFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Platform Fee<span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Fee charged by the platform for this escrow." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-filled platform fee"
                      value={field.value !== "" ? `${field.value}%` : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Amount<span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Total amount to be held in escrow." />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <Input
                        type="string"
                        className="pl-10"
                        placeholder="Enter the escrow amount"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("amount", e.target.value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Description<span className="text-destructive ml-1">*</span>
                <TooltipInfo content="Description that clearly explains the purpose of the escrow." />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escrow description"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("description", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="flex items-center">
            Milestones<span className="text-destructive ml-1">*</span>
            <TooltipInfo content="Key stages or deliverables for the escrow." />
          </FormLabel>
          {milestones.map((milestone, index) => (
            <>
              <div key={index} className="flex items-center space-x-4">
                <Input
                  placeholder="Milestone Description"
                  value={milestone.description}
                  onChange={(e) => {
                    const updatedMilestones = [...milestones];
                    updatedMilestones[index].description = e.target.value;
                    form.setValue("milestones", updatedMilestones);
                    handleFieldChange("milestones", updatedMilestones);
                  }}
                />
              </div>
            </>
          ))}
        </div>

        <div className="flex justify-start">
          <Button
            className="w-full md:w-1/4"
            type="submit"
            disabled={isAnyMilestoneEmpty}
          >
            Initialize Escrow
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InitializeEscrowForm;
