import React from "react";
import {
  Dispute,
  DisputeEvent,
  DisputeResolution,
} from "../../../../@types/dispute.entity";
import {
  Clock,
  MessageSquare,
  Flag,
  CheckCircle2,
  FileText,
  User,
  AlertTriangle,
} from "lucide-react";
import { useDisputeTimeline } from "../../../../utils/hook/dispute.hook";
import { Badge } from "../../../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { format } from "date-fns";
import { getStatusBadgeClass } from "../../../../utils/ui/status-badges";

interface DisputeTimelineProps {
  dispute: Dispute;
  className?: string;
}

export const DisputeTimeline: React.FC<DisputeTimelineProps> = ({
  dispute,
  className = "",
}) => {
  const events = useDisputeTimeline(dispute);

  if (events.length === 0) {
    return (
      <div className={`text-center p-4 text-muted-foreground ${className}`}>
        No events to display.
      </div>
    );
  }

  // Safe string truncation helper
  const truncateString = (str: string, startLen = 8, endLen = 6): string => {
    if (!str || str.length <= startLen + endLen) {
      return str || "";
    }
    return `${str.substring(0, startLen)}...${str.substring(str.length - endLen)}`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "created":
        return <Flag className="h-5 w-5 text-orange-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "evidence_added":
        return <FileText className="h-5 w-5 text-violet-500" />;
      case "updated":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventTitle = (event: DisputeEvent) => {
    switch (event.eventType) {
      case "created":
        return "Dispute Created";
      case "message":
        return "Message Added";
      case "evidence_added":
        return "Evidence Uploaded";
      case "updated":
        return "Dispute Updated";
      case "resolved":
        return "Dispute Resolved";
      default:
        return "Event";
    }
  };

  const getEventContent = (event: DisputeEvent) => {
    switch (event.eventType) {
      case "created":
        return (
          <div className="space-y-1">
            <p className="text-sm">
              A dispute was initiated for escrow{" "}
              <span className="font-mono text-xs">
                {truncateString(dispute.escrowId, 8, 0)}
              </span>
            </p>
            <p className="text-sm font-medium">Reason:</p>
            <p className="text-sm bg-muted p-2 rounded-md">
              {event.details.reason || dispute.reason}
            </p>
          </div>
        );

      case "message":
        return (
          <div className="space-y-1">
            <p className="text-sm">{event.details.message}</p>
          </div>
        );

      case "evidence_added":
        return (
          <div className="space-y-1">
            <p className="text-sm">New evidence was added to the dispute.</p>
            {event.details.description && (
              <p className="text-sm italic">
                &ldquo;{event.details.description}&rdquo;
              </p>
            )}
            {event.details.fileUrl && (
              <a
                href={event.details.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline flex items-center"
              >
                <FileText className="h-3 w-3 mr-1" /> View Document
              </a>
            )}
          </div>
        );

      case "updated":
        return (
          <div className="space-y-1">
            <p className="text-sm">The dispute status was updated.</p>
            {event.details.status && (
              <Badge variant="outline">{event.details.status}</Badge>
            )}
          </div>
        );

      case "resolved":
        return (
          <div className="space-y-1">
            <p className="text-sm">The dispute has been resolved.</p>
            {event.details.resolution && (
              <Badge
                variant="outline"
                className={
                  event.details.resolution === DisputeResolution.FAVOR_CLIENT
                    ? getStatusBadgeClass("blue")
                    : event.details.resolution ===
                        DisputeResolution.FAVOR_FREELANCER
                      ? getStatusBadgeClass("green")
                      : event.details.resolution === DisputeResolution.SPLIT
                        ? getStatusBadgeClass("purple")
                        : getStatusBadgeClass("gray")
                }
              >
                {event.details.resolution}
              </Badge>
            )}
            {event.details.details && (
              <div className="mt-2">
                <p className="text-sm font-medium">Resolution Details:</p>
                <p className="text-sm bg-muted p-2 rounded-md">
                  {event.details.details}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <p className="text-sm">Event details not available.</p>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Dispute Timeline</h3>

      <div className="relative border-l border-muted pl-6 pb-2 space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative pb-1">
            {/* Timeline dot */}
            <div className="absolute -left-[25px] flex items-center justify-center p-1 bg-background border rounded-full">
              {getEventIcon(event.eventType)}
            </div>

            {/* Event content */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-primary">
                  {getEventTitle(event)}
                </h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground">
                        {format(
                          new Date(event.timestamp),
                          "MMM d, yyyy h:mm a",
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {format(
                          new Date(event.timestamp),
                          "MMMM d, yyyy h:mm:ss a",
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {getEventContent(event)}

              {/* User who performed the action */}
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                <span className="font-mono">
                  {truncateString(event.performedBy)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
