import { Notification } from "@/@types/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FC } from "react";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationCard: FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const {
    id,
    title,
    message,
    timestamp,
    type = "info",
    action,
    isRead,
  } = notification;

  const typeStyles = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        typeStyles[type],
        !isRead && "border-l-4",
        !isRead && {
          "border-l-blue-500": type === "info",
          "border-l-green-500": type === "success",
          "border-l-yellow-500": type === "warning",
          "border-l-red-500": type === "error",
        },
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {message}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </span>
              {!isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => onMarkAsRead(id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
          {action && (
            <Link
              href={action.url}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {action.label}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
