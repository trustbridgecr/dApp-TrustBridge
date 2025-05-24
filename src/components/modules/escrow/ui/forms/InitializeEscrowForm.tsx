"use client";

import { useEffect, useState } from "react";
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
import TooltipInfo from "@/components/utils/ui/Tooltip";
import SelectField from "@/components/utils/ui/SelectSearch";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  FileText,
  Briefcase,
  User,
  Shield,
  Gavel,
  Wallet,
  Percent,
  Milestone,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useMarketplaceStore } from "@/components/modules/dashboard/marketplace/store/marketplace";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInitializeEscrow } from "../../hooks/initialize-escrow.hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InitializeEscrowForm = () => {
  const {
    form,
    milestones,
    onSubmit,
    userOptions,
    showSelect,
    trustlinesOptions,
    isAnyMilestoneEmpty,
    isSendingTransaction,
  } = useInitializeEscrow();

  const { selectedLoan, clearSelectedLoan } = useMarketplaceStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (selectedLoan) {
      form.setValue("amount", selectedLoan.maxAmount?.toString() || "");
      form.setValue("platformFee", selectedLoan.platformFee?.toString() || "");
      form.setValue(
        "roles.platformAddress",
        selectedLoan.platformAddress || "",
      );
      form.setValue("roles.approver", selectedLoan.approver || "");
      form.setValue("roles.releaseSigner", selectedLoan.releaseSigner || "");
      form.setValue(
        "roles.disputeResolver",
        selectedLoan.disputeResolver || "",
      );
      form.setValue(
        "milestones",
        (selectedLoan.milestones || []).map((m: any) => ({
          description: m.description,
          status: m.status ?? "pending",
          evidence: m.evidence ?? "",
          approvedFlag: m.approvedFlag ?? false,
        })),
      );
    }

    return () => {
      clearSelectedLoan();
    };
  }, [selectedLoan, form, clearSelectedLoan]);

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Card className="w-full border-muted shadow-sm mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              <h1 className="text-4xl font-bold">Request a New Loan</h1>
            </CardTitle>
            <CardDescription>
              Complete the form below to request a microloan with secure,
              transparent terms.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors",
                  i + 1 === currentStep
                    ? "bg-emerald-500"
                    : i + 1 < currentStep
                      ? "bg-emerald-200"
                      : "bg-gray-200",
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <CardContent className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
                >
                  Step 1
                </Badge>
                <h3 className="font-medium">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Title<span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="Significant title for escrow." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Escrow title"
                            className="pl-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </div>
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
                      <FormLabel className="flex items-center gap-1">
                        Engagement
                        <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="Unique identifier for this escrow engagement." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter identifier"
                            className="pl-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="trustline.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trustline</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const selectedOption = trustlinesOptions.find(
                                (opt) => opt.value === value,
                              );
                              if (selectedOption) {
                                field.onChange(selectedOption.value);
                              }
                            }}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a trustline" />
                            </SelectTrigger>
                            <SelectContent>
                              {trustlinesOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Description
                        <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="Description that clearly explains the purpose of the escrow." />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escrow description"
                          className="min-h-[120px] resize-none"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Amount<span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="Total amount to be held in escrow." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="string"
                            className="pl-10"
                            placeholder="Enter the escrow amount"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}

          {currentStep === 2 && (
            <CardContent className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
                >
                  Step 2
                </Badge>
                <h3 className="font-medium">Parties & Addresses</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roles.approver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Approver
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Address of the approver for this escrow." />
                        </span>
                      </FormLabel>

                      <FormControl>
                        {showSelect.approver ? (
                          <SelectField
                            control={form.control}
                            name="roles.approver"
                            label=""
                            tooltipContent="A"
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly
                              className="bg-gray-100 cursor-not-allowed pl-10 font-mono text-sm"
                              placeholder="Auto-filled approver address"
                              {...field}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles.serviceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Service Provider
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Address of the service provider for this escrow." />
                        </span>
                      </FormLabel>
                      <FormControl>
                        {showSelect.serviceProvider ? (
                          <SelectField
                            control={form.control}
                            name="roles.serviceProvider"
                            label=""
                            tooltipContent=""
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter service provider address"
                              className="pl-10 font-mono text-sm"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles.receiver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Receiver
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Address of the receiver for this escrow." />
                        </span>
                      </FormLabel>
                      <FormControl>
                        {showSelect.receiver ? (
                          <SelectField
                            control={form.control}
                            name="roles.receiver"
                            label=""
                            tooltipContent=""
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter service provider address"
                              className="pl-10 font-mono text-sm"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roles.releaseSigner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Release Signer
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Entity authorized to release funds from escrow." />
                        </span>
                      </FormLabel>
                      <FormControl>
                        {showSelect.releaseSigner ? (
                          <SelectField
                            control={form.control}
                            name="roles.releaseSigner"
                            label=""
                            tooltipContent=""
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly
                              className="bg-gray-100 cursor-not-allowed pl-10 font-mono text-sm"
                              placeholder="Auto-filled release signer"
                              {...field}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roles.disputeResolver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Dispute Resolver
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Entity responsible for resolving disputes." />
                        </span>
                      </FormLabel>
                      <FormControl>
                        {showSelect.disputeResolver ? (
                          <SelectField
                            control={form.control}
                            name="roles.disputeResolver"
                            label=""
                            tooltipContent=""
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <Gavel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly
                              className="bg-gray-100 cursor-not-allowed pl-10 font-mono text-sm"
                              placeholder="Auto-filled dispute resolver"
                              {...field}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" mb-6">
                <FormField
                  control={form.control}
                  name="roles.platformAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          Platform Address{" "}
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="Public key of the platform managing the escrow." />
                        </span>
                      </FormLabel>
                      <FormControl>
                        {showSelect.platformAddress ? (
                          <SelectField
                            control={form.control}
                            name="roles.platformAddress"
                            label=""
                            tooltipContent=""
                            options={userOptions}
                          />
                        ) : (
                          <div className="relative">
                            <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              readOnly
                              className="bg-gray-100 cursor-not-allowed pl-10 font-mono text-sm"
                              placeholder="Auto-filled platform address"
                              {...field}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}

          {currentStep === 3 && (
            <CardContent className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
                >
                  Step 3
                </Badge>
                <h3 className="font-medium">Milestones</h3>
              </div>

              <div className="space-y-4 mb-6">
                <FormLabel className="flex items-center gap-1">
                  Milestones<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Key stages or deliverables for the escrow." />
                </FormLabel>

                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-4">
                    {milestones.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Milestone className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          No milestones added yet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Add at least one milestone to continue
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 group"
                          >
                            <div className="bg-muted/50 rounded-full p-1.5 flex-shrink-0">
                              <span className="text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <Input
                              placeholder="Milestone Description"
                              className="bg-gray-100 cursor-not-allowed  font-mono text-sm"
                              readOnly
                              value={milestone.description}
                              onChange={(e) => {
                                const updatedMilestones = [...milestones];
                                updatedMilestones[index].description =
                                  e.target.value;
                                form.setValue("milestones", updatedMilestones);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          )}

          <CardFooter className="flex justify-between border-t p-6">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <Button type="button" onClick={handleNextStep} className="gap-1">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={isAnyMilestoneEmpty || isSendingTransaction}
              >
                {isSendingTransaction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Escrow...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Initialize Escrow
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default InitializeEscrowForm;
