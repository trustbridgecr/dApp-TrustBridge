import { Badge } from "@/components/ui/badge";
import { Milestone } from "@trustless-work/escrow/types";
import { Escrow } from "@trustless-work/escrow/types";
import { CheckCircle2 } from "lucide-react";

interface EscrowMilestonesSectionProps {
  escrow: Escrow | null;
}

export const EscrowMilestonesSection = ({
  escrow,
}: EscrowMilestonesSectionProps) => {
  return (
    <div className="space-y-4">
      {escrow?.milestones.map((milestone: Milestone, index: number) => (
        <div
          key={index}
          className={`border rounded-lg p-4 transition-all ${
            milestone.status === "approved" || milestone.approvedFlag
              ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20"
              : "hover:border-primary"
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full uppercase ${
                  milestone.status === "approved" || milestone.approvedFlag
                    ? "bg-green-100 dark:bg-green-900/50"
                    : "bg-muted"
                }`}
              >
                <span className="font-medium text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium">Milestone {index + 1}</p>
                <p className="text-muted-foreground text-sm">
                  {milestone.description}
                </p>
              </div>
            </div>
            <div className="flex justify-start flex-col gap-2">
              <>
                {milestone.status && (
                  <Badge
                    variant={
                      milestone.status === "approved" ? "default" : "secondary"
                    }
                    className={
                      milestone.status === "approved"
                        ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/70 uppercase"
                        : "uppercase"
                    }
                  >
                    {milestone.status === "approved" ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                      </>
                    ) : (
                      milestone.status
                    )}
                  </Badge>
                )}
                {milestone.approvedFlag && !milestone.status && (
                  <Badge
                    variant="outline"
                    className="border-green-200 dark:border-green-900 text-green-800 dark:text-green-200 uppercase"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                  </Badge>
                )}
              </>
            </div>
          </div>

          {milestone.evidence && (
            <p className="text-muted-foreground text-sm mt-4 truncate">
              <span className="font-medium">Evidence:</span>{" "}
              {milestone.evidence}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
