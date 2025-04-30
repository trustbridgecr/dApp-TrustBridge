import { NotificationAction, NotificationState } from "@/@types/notification";
import { getStellarAddress } from "@/components/utils/wallet/getStellarAddress";
import { notificationService } from "@/lib/services/notificationService";
import { useCallback, useEffect, useReducer } from "react";

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
  hasUnread: false,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        hasUnread: action.payload.some((n) => !n.isRead),
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        hasUnread: true,
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n,
        ),
        hasUnread: state.notifications.some(
          (n) => !n.isRead && n.id !== action.payload,
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function useNotifications() {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const fetchNotifications = useCallback(async () => {
    const address = getStellarAddress();
    if (!address) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const notifications =
        await notificationService.fetchNotifications(address);
      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch notifications" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  }, []);

  useEffect(() => {
    const address = getStellarAddress();
    if (!address) return;

    fetchNotifications();

    notificationService.connect(address);
    notificationService.onMessage((notification) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    });

    notificationService.onError((error) => {
      dispatch({ type: "SET_ERROR", payload: error });
    });

    return () => {
      notificationService.disconnect();
    };
  }, [fetchNotifications]);

  return {
    ...state,
    markAsRead,
    refetch: fetchNotifications,
  };
}
