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
  return [walletA, walletB].sort().join("_");
};

export const initializeChat = async (walletA: string, walletB: string) => {
  const chatId = getChatId(walletA, walletB);
  const chatDocRef = doc(db, "chats", chatId);

  try {
    const chatDoc = await getDoc(chatDocRef);
    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {
        participants: [walletA, walletB].sort(),
        createdAt: Date.now(),
        lastMessage: null,
        lastMessageTime: null,
      });
    }
  } catch (error) {
    console.error("Error initializing chat:", error);
  }
};

export const sendMessage = async (
  from: string,
  to: string,
  content: string,
) => {
  try {
    await initializeChat(from, to);
    const chatId = getChatId(from, to);
    const col = collection(db, "chats", chatId, "messages");

    await addDoc(col, {
      from,
      to,
      content,
      timestamp: Date.now(),
      status: "sent",
    });

    const chatDocRef = doc(db, "chats", chatId);
    await setDoc(
      chatDocRef,
      {
        lastMessage: content,
        lastMessageTime: Date.now(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const fetchMessages = async (
  walletA: string,
  walletB: string,
): Promise<ChatMessage[]> => {
  const chatId = getChatId(walletA, walletB);
  const col = collection(db, "chats", chatId, "messages");
  const q = query(col, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<ChatMessage, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });
};

export const listenToMessages = async (
  walletA: string,
  walletB: string,
  callback: (messages: ChatMessage[]) => void,
): Promise<Unsubscribe> => {
  const chatId = getChatId(walletA, walletB);
  await initializeChat(walletA, walletB);

  const col = collection(db, "chats", chatId, "messages");
  const q = query(col, orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const msgs: ChatMessage[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<ChatMessage, "id">;
        return {
          id: doc.id,
          ...data,
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
