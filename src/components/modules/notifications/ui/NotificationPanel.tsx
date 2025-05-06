"use client";

import { FC, useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "../hooks/notifications.hook";

interface NotificationPanelProps {
  showInitialAlert?: boolean;
}

export const NotificationPanel: FC<NotificationPanelProps> = ({
  showInitialAlert = true,
}) => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    hasUnreadNotifications,
    unreadCount,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialAlertShown, setInitialAlertShown] = useState<boolean>(false);

  // Show notifications popup on login if there are unread notifications
  useEffect(() => {
    if (
      showInitialAlert &&
      hasUnreadNotifications &&
      !initialAlertShown &&
      !isOpen &&
      !loading
    ) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setInitialAlertShown(true);
      }, 1500); // Delay to ensure page is loaded

      return () => clearTimeout(timer);
    }
  }, [
    hasUnreadNotifications,
    initialAlertShown,
    isOpen,
    loading,
    showInitialAlert,
  ]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-500">
              {unreadCount > 0 && unreadCount < 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
              {unreadCount >= 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                  9+
                </span>
              )}
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0" align="end">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-medium">Notifications</h3>
        </div>
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
        <div className="p-2 border-t text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground w-full"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
