import { Escrow } from "@trustless-work/escrow/types";
import { FileText, Info, Shield } from "lucide-react";

interface EscrowDetailsSectionProps {
  escrow: Escrow | null;
}

export const EscrowDetailsSection = ({ escrow }: EscrowDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        Escrow Details
      </h3>

      <div className="grid gap-3 text-sm">
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Escrow ID</p>
            <p className="text-muted-foreground break-all text-xs">
              {escrow?.contractId || "Not deployed yet"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Engagement ID</p>
            <p className="text-muted-foreground text-xs">
              {escrow?.engagementId || "Not deployed yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
