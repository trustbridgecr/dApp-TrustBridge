import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMilestoneCompletion } from "../hooks/use-milestone-completion.hook";

interface CompleteMilestoneButtonProps {
  escrowId: string;
  milestoneId: string;
  onSuccess: () => void;
  disabled?: boolean;
}

export const CompleteMilestoneButton = ({
  escrowId,
  milestoneId,
  onSuccess,
  disabled = false,
}: CompleteMilestoneButtonProps) => {
  const { completeMilestone, completing } = useMilestoneCompletion(onSuccess);

  const handleComplete = async () => {
    await completeMilestone(escrowId, milestoneId);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleComplete}
      disabled={disabled || completing}
    >
      {completing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Completing...
        </>
      ) : (
        "Mark Complete"
      )}
    </Button>
  );
};
