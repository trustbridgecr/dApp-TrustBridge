"use client";

import type { Escrow } from "@/@types/escrow.entity";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, User } from "lucide-react";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface EscrowApprovalCardProps {
  escrow: Escrow;
  onApprove: (escrow: Escrow, milestoneIndex: string) => void;
}

export function EscrowApprovalCard({
  escrow,
  onApprove,
}: EscrowApprovalCardProps) {
  // Find milestones that need approval (flag is false)
  const pendingMilestones = escrow.milestones
    .map((milestone, index) => ({ ...milestone, index }))
    .filter((milestone) => milestone.flag === false);
  const { formatAddress } = useFormatUtils();
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{escrow.title}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {escrow.amount} {escrow.trustline?.name || "XLM"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {escrow.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Participants</span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Issuer:</span>
              </div>
              <span>{formatAddress(escrow.issuer)}</span>

              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Provider:</span>
              </div>
              <span>{formatAddress(escrow.serviceProvider)}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Pending Milestones</h4>
            <div className="space-y-2">
              {pendingMilestones.map((milestone) => (
                <div
                  key={milestone.index}
                  className="p-3 border rounded-md bg-muted/50"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">
                        Milestone {milestone.index + 1}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {milestone.status || "pending"}
                    </Badge>
                  </div>
                  <p className="text-sm line-clamp-2">
                    {milestone.description}
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-2 cursor-pointer"
                    onClick={() =>
                      onApprove(escrow, milestone.index.toString())
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="text-xs text-muted-foreground w-full">
          <div className="flex justify-between">
            <span>Contract ID:</span>
            <span className="font-mono">
              {formatAddress(escrow.contractId || "")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
