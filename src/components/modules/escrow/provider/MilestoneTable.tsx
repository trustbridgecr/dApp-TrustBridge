import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CompleteMilestoneButton } from "./CompleteMilestoneButton";
import { Milestone } from "../services/service-provider-milestone.service";

interface MilestoneTableProps {
  escrowId: string;
  milestones: Milestone[];
  onMilestoneComplete: () => void;
}

export const MilestoneTable = ({
  escrowId,
  milestones,
  onMilestoneComplete,
}: MilestoneTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {milestones.map((milestone) => (
          <TableRow key={milestone.id}>
            <TableCell className="font-medium">{milestone.title}</TableCell>
            <TableCell>{milestone.description}</TableCell>
            <TableCell>{milestone.amount} ETH</TableCell>
            <TableCell>
              {new Date(milestone.dueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  milestone.status === "complete"
                    ? "default"
                    : milestone.status === "cancelled"
                      ? "destructive"
                      : "outline"
                }
              >
                {milestone.status}
              </Badge>
            </TableCell>
            <TableCell>
              {milestone.status === "pending" && (
                <CompleteMilestoneButton
                  escrowId={escrowId}
                  milestoneId={milestone.id}
                  onSuccess={onMilestoneComplete}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
