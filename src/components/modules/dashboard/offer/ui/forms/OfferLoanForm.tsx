"use client"

import { useState, useEffect } from "react"
import {
  Info,
  Trash2,
  Plus,
  DollarSign,
  User,
  FileText,
  Wallet,
  CheckCircle2,
  Milestone,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useOfferLoanForm } from "../../hooks/offer-loan.hook"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function OfferLoanForm() {
  const { form, fieldArray, onSubmit } = useOfferLoanForm()
  const {
    register,
    formState: { errors, isSubmitting, isDirty },
    trigger,
    getValues,
  } = form
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3


  const [showValidationErrors, setShowValidationErrors] = useState(false)


  useEffect(() => {
    setShowValidationErrors(false)
  }, [currentStep])

  const handleNextStep = async () => {
    if (currentStep < totalSteps) {

      let isValid = false

      if (currentStep === 1) {

        isValid = await trigger(["title", "maxAmount", "description"])
        console.log("Step 1 validation:", isValid, getValues(["title", "maxAmount", "description"]))
      } else if (currentStep === 2) {

        const values = getValues(["approver", "releaseSigner", "platformAddress"])
        isValid = values.every((value) => value.trim() !== "")
        console.log("Step 2 validation:", isValid, values)
      } else if (currentStep === 3) {

        isValid = fieldArray.fields.length > 0
        console.log("Step 3 validation:", isValid, fieldArray.fields)
      }


      if (isValid) {
        setCurrentStep((prev) => prev + 1)

        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {

        setShowValidationErrors(true)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)

      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Card className="w-full border-muted shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              <h1 className="text-4xl font-bold">Create Loan Offer</h1>
            </CardTitle>
            <CardDescription>Define the terms and conditions for your loan offer</CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors",
                  i + 1 === currentStep ? "bg-emerald-500" : i + 1 < currentStep ? "bg-emerald-200" : "bg-gray-200",
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit}>
        {currentStep === 1 && (
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                Step 1
              </Badge>
              <h3 className="font-medium">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1">
                  Title <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="title"
                    placeholder="Loan title"
                    className={cn("pl-10", errors.title ? "border-rose-500 focus-visible:ring-rose-500" : "")}
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount" className="flex items-center gap-1">
                  Max Amount <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxAmount"
                    placeholder="100.00"
                    className={cn("pl-10", errors.maxAmount ? "border-rose-500 focus-visible:ring-rose-500" : "")}
                    {...register("maxAmount")}
                  />
                </div>
                {errors.maxAmount && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.maxAmount.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="description" className="flex items-center gap-1">
                Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the purpose and terms of the loan"
                className={cn(errors.description ? "border-rose-500 focus-visible:ring-rose-500" : "")}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message?.toString()}
                </p>
              )}
            </div>
          </CardContent>
        )}

        {currentStep === 2 && (
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                Step 2
              </Badge>
              <h3 className="font-medium">Wallet Addresses</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="approver" className="flex items-center gap-1">
                  Approver <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="approver"
                    placeholder="Approver wallet address"
                    className={cn(
                      "pl-10 font-mono text-sm",
                      errors.approver ? "border-rose-500 focus-visible:ring-rose-500" : "",
                    )}
                    {...register("approver")}
                  />
                </div>
                {errors.approver && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.approver.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseSigner" className="flex items-center gap-1">
                  Release Signer <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="releaseSigner"
                    placeholder="Signer wallet address"
                    className={cn(
                      "pl-10 font-mono text-sm",
                      errors.releaseSigner ? "border-rose-500 focus-visible:ring-rose-500" : "",
                    )}
                    {...register("releaseSigner")}
                  />
                </div>
                {errors.releaseSigner && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.releaseSigner.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platformAddress" className="flex items-center gap-1">
                Platform Address <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="platformAddress"
                  placeholder="Platform wallet address"
                  className={cn(
                    "pl-10 font-mono text-sm",
                    errors.platformAddress ? "border-rose-500 focus-visible:ring-rose-500" : "",
                  )}
                  {...register("platformAddress")}
                />
              </div>
              {errors.platformAddress && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.platformAddress.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <Input readOnly hidden placeholder="Resolver wallet address" {...register("disputeResolver")} />
            </div>
          </CardContent>
        )}

        {currentStep === 3 && (
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                Step 3
              </Badge>
              <h3 className="font-medium">Milestones</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium flex items-center gap-1">
                  Milestones <span className="text-rose-500">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Define one or more conditions for the borrower to meet.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>

              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  {fieldArray.fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Milestone className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No milestones added yet</p>
                      <p className="text-xs text-muted-foreground">Add at least one milestone to continue</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fieldArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 group">
                          <div className="bg-muted/50 rounded-full p-1.5 flex-shrink-0">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <Input
                            placeholder="Milestone Description"
                            {...register(`milestones.${index}.description`)}
                            className={cn(
                              "flex-1",
                              errors.milestones?.[index]?.description
                                ? "border-rose-500 focus-visible:ring-rose-500"
                                : "",
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => fieldArray.remove(index)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center">
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
                </CardContent>
              </Card>

              {fieldArray.fields.length === 0 && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Please add at least one milestone
                </p>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="flex justify-between border-t p-6 relative">
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
              className="bg-gradient-to-r from-emerald-600 to-teal-900 hover:from-emerald-700 hover:to-teal-600 gap-1"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? "Submitting..." : "Submit Loan Offer"}
            </Button>
          )}
          {showValidationErrors && (
            <div className="absolute -top-10 right-6 bg-rose-50 text-rose-700 px-3 py-2 rounded-md text-sm flex items-center gap-1.5 shadow-sm border border-rose-200">
              <AlertCircle className="h-4 w-4" />
              Please fix the errors before proceeding
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
