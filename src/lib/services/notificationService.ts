import { Notification } from "@/@types/notification";

class NotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = parseInt(
    process.env.NEXT_PUBLIC_MAX_RECONNECT_ATTEMPTS || "5",
  );
  private reconnectTimeout = parseInt(
    process.env.NEXT_PUBLIC_RECONNECT_TIMEOUT || "1000",
  );
  private onMessageCallback: ((notification: Notification) => void) | null =
    null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor(
    private readonly wsUrl: string = process.env.NEXT_PUBLIC_WS_URL ||
      "ws://localhost:3001",
    private readonly apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "",
  ) {}

  connect(address: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(`${this.wsUrl}/notifications?address=${address}`);

      this.ws.onopen = () => {
        console.log("🔌 WebSocket connection established");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data) as Notification;
          this.onMessageCallback?.(notification);
        } catch (error) {
          console.error("❌ Error parsing notification:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.onErrorCallback?.("Failed to connect to notification service");
      };

      this.ws.onclose = () => {
        console.log("🔌 WebSocket connection closed");
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("❌ Error establishing WebSocket connection:", error);
      this.onErrorCallback?.("Failed to establish connection");
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.onErrorCallback?.("Maximum reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    setTimeout(() => {
      this.connect(this.getStoredAddress() || "");
    }, this.reconnectTimeout * this.reconnectAttempts);
  }

  private getStoredAddress(): string | null {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem("address-wallet");
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      return parsed.state?.address ?? null;
    } catch {
      return null;
    }
  }

  onMessage(callback: (notification: Notification) => void) {
    this.onMessageCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async fetchNotifications(address: string): Promise<Notification[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/notifications?address=${address}`,
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return await response.json();
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
