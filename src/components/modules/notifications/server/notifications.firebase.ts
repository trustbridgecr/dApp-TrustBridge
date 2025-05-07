"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export interface Notification {
  id?: string;
  userId: string;
  userType: "borrower" | "lender";
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
  isRead: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

/**
 * Create a new notification
 */
export const createNotification = async (
  notification: Omit<Notification, "isRead" | "createdAt">,
): Promise<{
  success: boolean;
  message: string;
  data?: Notification;
}> => {
  try {
    const ref = collection(db, "notifications");

    const docRef: DocumentReference<DocumentData> = await addDoc(ref, {
      ...notification,
      isRead: false,
      createdAt: serverTimestamp(),
    });

    const createdDoc = await getDoc(docRef);

    return {
      success: true,
      message: "Notification created successfully",
      data: { id: docRef.id, ...(createdDoc.data() as Notification) },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create notification",
    };
  }
};

/**
 * Get notifications for a specific user
 */
export const getUserNotifications = async (
  userId: string,
  limitCount = 10,
  onlyUnread = false,
): Promise<{
  success: boolean;
  data?: Notification[];
  message?: string;
}> => {
  try {
    const ref = collection(db, "notifications");
    let q = query(
      ref,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount),
    );

    if (onlyUnread) {
      q = query(q, where("isRead", "==", false));
    }

    const snapshot = await getDocs(q);

    const notifications = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Notification),
    }));

    return {
      success: true,
      data: notifications,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error retrieving notifications",
    };
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);

    await updateDoc(notificationRef, {
      isRead: true,
    });

    return {
      success: true,
      message: "Notification marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update notification",
    };
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const ref = collection(db, "notifications");
    const q = query(
      ref,
      where("userId", "==", userId),
      where("isRead", "==", false),
    );

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((doc) => {
      const docRef = doc.ref;
      return updateDoc(docRef, {
        isRead: true,
      });
    });

    await Promise.all(updatePromises);

    return {
      success: true,
      message: "All notifications marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update notifications",
    };
  }
};
