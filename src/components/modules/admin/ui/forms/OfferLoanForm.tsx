"use client";

import { Info, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOfferLoanForm } from "../../hooks/offer-loan.hook";

export function OfferLoanForm() {
  const { form, fieldArray, onSubmit } = useOfferLoanForm();
  const { register } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-8 px-8 py-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2">
            Title <span className="text-rose-500">*</span>
          </Label>
          <Input placeholder="Loan title" {...register("title")} />
        </div>

        <div>
          <Label className="mb-2">
            Max Amount <span className="text-rose-500">*</span>
          </Label>
          <Input placeholder="100.00" {...register("maxAmount")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2">
            Approver <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="Approver wallet address"
            {...register("approver")}
          />
        </div>

        <div>
          <Label className="mb-2">
            Release Signer <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="Signer wallet address"
            {...register("releaseSigner")}
          />
        </div>

        <div>
          <Label className="mb-2">
            Dispute Resolver <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="Resolver wallet address"
            {...register("disputeResolver")}
          />
        </div>

        <div>
          <Label className="mb-2">
            Platform Address <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="Platform wallet address"
            {...register("platformAddress")}
            readOnly
          />
        </div>
      </div>

      <div>
        <Label className="mb-2">
          Description <span className="text-rose-500">*</span>
        </Label>
        <Textarea
          rows={4}
          placeholder="Describe the purpose and terms of the loan"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium flex items-center gap-1">
            Milestones <span className="text-rose-500">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Define one or more conditions for the borrower to meet.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>

        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="Milestone Description"
              {...register(`milestones.${index}.description`)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fieldArray.remove(index)}
              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fieldArray.append({ description: "" })}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Milestone
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full py-6 text-base font-medium">
        Submit Loan Offer
      </Button>
    </form>
  );
}
