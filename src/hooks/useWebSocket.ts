import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  Notification,
  useNotificationsStore,
} from "@/core/store/notifications";
import { useEffect, useRef, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
const POLLING_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_POLLING_INTERVAL || "30000",
); // 30 seconds default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const addNotification = useNotificationsStore(
    (state) => state.addNotification,
  );

  const connectWebSocket = () => {
    if (!address) {
      console.log("No address available, skipping WebSocket connection");
      return;
    }

    try {
      console.log("Attempting to connect to WebSocket with address:", address);
      const ws = new WebSocket(`${WS_URL}/notifications?address=${address}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          console.log("Received WebSocket message:", event.data);
          const notification: Notification = JSON.parse(event.data);
          console.log("Parsed notification:", notification);
          addNotification(notification);
        } catch (err) {
          console.error("Error parsing notification:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection error");
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log(
          "WebSocket disconnected. Code:",
          event.code,
          "Reason:",
          event.reason,
        );
        setIsConnected(false);
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
      };
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      setError("Failed to create WebSocket connection");
    }
  };

  const startPolling = () => {
    if (!address) {
      console.log("No address available, skipping polling");
      return;
    }

    const poll = async () => {
      try {
        console.log("Polling for notifications...");
        const response = await fetch(
          `${API_URL}/api/notifications?address=${address}`,
        );
        if (response.ok) {
          const notifications: Notification[] = await response.json();
          console.log("Received notifications:", notifications);
          notifications.forEach(addNotification);
        } else {
          console.error(
            "Polling request failed:",
            response.status,
            response.statusText,
          );
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    // Initial poll
    poll();
    // Set up interval for polling
    const intervalId = setInterval(poll, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    console.log("useWebSocket effect triggered. Address:", address);
    if (!address) return;

    // Try WebSocket first
    connectWebSocket();

    // If WebSocket fails, fall back to polling
    if (!isConnected && !error) {
      console.log("WebSocket not connected, starting polling");
      const cleanup = startPolling();
      return cleanup;
    }

    return () => {
      console.log("Cleaning up WebSocket connection");
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [address, isConnected, error]);

  return { isConnected, error };
};
