import { useEffect, useState } from "react";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatMessage, ChatWithMessages } from "@/@types/chat.entity";

export const useAllChats = (walletAddress: string) => {
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupChats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set up real-time listener for all chats
        const chatsRef = collection(db, "chats");
        const q = query(
          chatsRef,
          where("participants", "array-contains", walletAddress),
        );

        unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const updatedChats = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const chatData = doc.data() as Omit<
                  ChatWithMessages,
                  "id" | "messages"
                >;
                const messages: ChatMessage[] = [];

                return {
                  id: doc.id,
                  ...chatData,
                  messages,
                } as ChatWithMessages;
              }),
            );

            setChats(updatedChats);
            setLoading(false);
          },
          (err) => {
            console.error("Error listening to chats:", err);
            setError("Error listening to chats");
            setLoading(false);
          },
        );
      } catch (err) {
        console.error("Error setting up chats:", err);
        setError("Error setting up chats");
        setLoading(false);
      }
    };

    setupChats();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [walletAddress]);

  return { chats, loading, error };
};
