"use client";

import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Bell, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Notification } from "../server/notifications.firebase";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const formattedDate = notification.createdAt
    ? format(
        new Date(notification.createdAt.seconds * 1000),
        "MMM dd, yyyy • h:mm a",
      )
    : "";

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (notification.id) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Card
      className={`mb-2 ${
        notification.isRead ? "opacity-75" : "border-emerald-500"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <div
              className={`p-2 rounded-full ${
                notification.isRead
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-emerald-100 dark:bg-emerald-900/50"
              }`}
            >
              <Bell
                className={`h-4 w-4 ${
                  notification.isRead
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.message}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {formattedDate}
                </span>
                {!notification.isRead && notification.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={handleMarkAsRead}
                  >
                    <Check className="h-3 w-3" /> Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {notification.actionLink && (
          <div className="mt-3 pt-3 border-t">
            <Link
              href={notification.actionLink}
              className="flex items-center justify-center w-full text-xs text-emerald-600 hover:text-emerald-700 font-medium gap-1"
            >
              {notification.actionText || "View Details"}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
