"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { FC } from "react";
import { Notification } from "../../server/notifications.firebase";
import { NotificationItem } from "../notificationItem/NotificationItem";


interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationList: FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const hasUnread = notifications.some((notification) => !notification.isRead);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-4">
          <Bell className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground text-center">
          You don&apos;t have any notifications at the moment. We&apos;ll notify
          you when there&apos;s activity.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-0">
      {hasUnread && (
        <div className="px-4 pt-2 pb-3 border-b mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-full justify-center"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck className="h-3 w-3" /> Mark all as read
          </Button>
        </div>
      )}
      <ScrollArea className="h-[350px] px-4">
        <div className="py-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
