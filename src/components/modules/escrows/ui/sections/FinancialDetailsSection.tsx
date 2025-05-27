import { DollarSign, Landmark, Percent, PiggyBank } from "lucide-react";
import { Escrow } from "@trustless-work/escrow/types";

interface FinancialDetailsSectionProps {
  escrow: Escrow | null;
}

export const FinancialDetailsSection = ({
  escrow,
}: FinancialDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Landmark className="h-4 w-4 text-primary" />
        Financial Information
      </h3>

      <div className="grid gap-3 text-sm">
        <div className="flex items-start gap-3">
          <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Amount</p>
            <p className="text-muted-foreground text-xs">{escrow?.amount}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PiggyBank className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Balance</p>
            <p className="text-muted-foreground text-xs">
              {escrow?.balance || "0"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Percent className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Platform Fee</p>
            <p className="text-muted-foreground text-xs">
              {escrow?.platformFee ? Number(escrow.platformFee) / 100 : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
