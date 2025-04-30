export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type?: "info" | "success" | "warning" | "error";
  action?: {
    label: string;
    url: string;
  };
  isRead: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  hasUnread: boolean;
}

export type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
