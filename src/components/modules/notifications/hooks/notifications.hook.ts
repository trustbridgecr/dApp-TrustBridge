"use client";

import { useState, useEffect, useCallback } from "react";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  Notification,
} from "../server/notifications.firebase";

export const useNotifications = () => {
  const { address } = useGlobalAuthenticationStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await getUserNotifications(address);
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError(response.message || "Failed to fetch notifications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [address]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!notificationId) return;

    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!address) return;

    try {
      const response = await markAllNotificationsAsRead(address);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true })),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchNotifications();
    }
  }, [address, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    hasUnreadNotifications: notifications.some((n) => !n.isRead),
    unreadCount: notifications.filter((n) => !n.isRead).length,
  };
};
