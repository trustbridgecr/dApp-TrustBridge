import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MilestoneTable } from "./MilestoneTable";
import { Escrow } from "../services/service-provider-milestone.service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface EscrowListProps {
  escrows: Escrow[];
  onMilestoneComplete: () => void;
}

export const EscrowList = ({
  escrows,
  onMilestoneComplete,
}: EscrowListProps) => {
  return (
    <div className="space-y-4">
      {escrows.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No escrows found
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {escrows.map((escrow) => (
            <AccordionItem value={escrow.id} key={escrow.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{escrow.title}</CardTitle>
                      <CardDescription>Client: {escrow.client}</CardDescription>
                      <CardDescription>
                        Total: {escrow.totalAmount} ETH
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        escrow.status === "active"
                          ? "default"
                          : escrow.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {escrow.status}
                    </Badge>
                  </div>
                  <AccordionTrigger className="pt-2">
                    View milestones
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <MilestoneTable
                      escrowId={escrow.id}
                      milestones={escrow.milestones}
                      onMilestoneComplete={onMilestoneComplete}
                    />
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
