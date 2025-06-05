import { UserChatData } from "@/@types/user.entity";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Unsubscribe,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type ChatMessage = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  status?: "sent" | "delivered" | "read";
};

export const getChatId = (walletA: string, walletB: string) => {
  if (
    !walletA ||
    !walletB ||
    walletA === "[wallet]" ||
    walletB === "[wallet]"
  ) {
    throw new Error("Invalid wallet addresses");
  }
  const sortedWallets = [walletA, walletB].sort();
  return sortedWallets.join("_");
};

export const initializeChat = async (walletA: string, walletB: string) => {
  if (
    !walletA ||
    !walletB ||
    walletA === "[wallet]" ||
    walletB === "[wallet]"
  ) {
    throw new Error("Invalid wallet addresses");
  }

  const chatId = getChatId(walletA, walletB);
  const chatDocRef = doc(db, "chats", chatId);

  try {
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {
        participants: [walletA, walletB].sort(),
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
      });
    }

    return chatId;
  } catch (error) {
    console.error("Error initializing chat:", error);
    throw error;
  }
};

export const sendMessage = async (
  from: string,
  to: string,
  content: string,
) => {
  if (!from || !to || from === "[wallet]" || to === "[wallet]") {
    throw new Error("Invalid wallet addresses");
  }

  try {
    const chatId = await initializeChat(from, to);
    const messagesCol = collection(db, "chats", chatId, "messages");

    const messageData = {
      from,
      to,
      content,
      timestamp: serverTimestamp(),
      status: "sent",
    };

    await addDoc(messagesCol, messageData);

    const chatDocRef = doc(db, "chats", chatId);
    await setDoc(
      chatDocRef,
      {
        lastMessage: content,
        lastMessageTime: serverTimestamp(),
      },
      { merge: true },
    );

    return messageData;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const convertTimestamp = (timestamp: Timestamp | Date | number): number => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === "number") {
    return timestamp;
  }
  return Date.now();
};

export const fetchMessages = async (
  walletA: string,
  walletB: string,
): Promise<ChatMessage[]> => {
  if (
    !walletA ||
    !walletB ||
    walletA === "[wallet]" ||
    walletB === "[wallet]"
  ) {
    return [];
  }

  const chatId = getChatId(walletA, walletB);
  const chatDocRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatDocRef);

  if (!chatDoc.exists()) {
    return [];
  }

  const messagesCol = collection(db, "chats", chatId, "messages");
  const q = query(messagesCol, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      from: data.from,
      to: data.to,
      content: data.content,
      timestamp: convertTimestamp(data.timestamp),
      status: data.status || "sent",
    };
  });
};

export const listenToMessages = async (
  walletA: string,
  walletB: string,
  callback: (messages: ChatMessage[]) => void,
): Promise<Unsubscribe> => {
  if (
    !walletA ||
    !walletB ||
    walletA === "[wallet]" ||
    walletB === "[wallet]"
  ) {
    callback([]);
    return () => {};
  }

  const chatId = getChatId(walletA, walletB);
  const chatDocRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatDocRef);

  if (!chatDoc.exists()) {
    callback([]);
    return () => {};
  }

  const messagesCol = collection(db, "chats", chatId, "messages");
  const q = query(messagesCol, orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const msgs: ChatMessage[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          from: data.from,
          to: data.to,
          content: data.content,
          timestamp: convertTimestamp(data.timestamp),
          status: data.status || "sent",
        };
      });
      callback(msgs);
    },
    (error) => {
      console.error("Error listening to messages:", error);
    },
  );

  return unsubscribe;
};

export const getUserChats = async (walletAddress: string) => {
  if (!walletAddress || walletAddress === "[wallet]") {
    return [];
  }

  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", walletAddress),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      participants: data.participants,
      createdAt: convertTimestamp(data.createdAt),
      lastMessage: data.lastMessage,
      lastMessageTime: convertTimestamp(data.lastMessageTime),
    };
  });
};

export const getUserData = async (
  walletAddress: string,
): Promise<UserChatData> => {
  if (!walletAddress || walletAddress === "[wallet]") {
    return {
      firstName: "Unknown",
      lastName: "",
      walletAddress: "",
    };
  }

  try {
    const userDocRef = doc(db, "users", walletAddress);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        firstName: data.firstName || "Unknown",
        lastName: data.lastName || "",
        walletAddress: data.walletAddress || walletAddress,
      };
    }

    return {
      firstName: "Unknown",
      lastName: "",
      walletAddress,
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    return {
      firstName: "Unknown",
      lastName: "",
      walletAddress,
    };
  }
};
