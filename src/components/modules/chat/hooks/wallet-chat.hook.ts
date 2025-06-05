"use client";

import { useEffect, useState } from "react";
import { listenToMessages, sendMessage } from "../lib/chat";

type ChatMessage = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  status?: "sent" | "delivered" | "read";
};

export const useWalletChat = (walletA: string, walletB: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !walletA ||
      !walletB ||
      walletA === "[wallet]" ||
      walletB === "[wallet]"
    ) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupChat = async () => {
      try {
        setLoading(true);
        setError(null);

        unsubscribe = await listenToMessages(
          walletA,
          walletB,
          (newMessages: ChatMessage[]) => {
            setMessages(newMessages);
            setLoading(false);
          },
        );
      } catch (err) {
        console.error("Error setting up chat:", err);
        setError("Error setting up chat");
        setLoading(false);
      }
    };

    setupChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [walletA, walletB]);

  const send = async (content: string) => {
    try {
      setError(null);
      await sendMessage(walletA, walletB, content);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message");
      throw err;
    }
  };

  return { messages, sendMessage: send, loading, error };
};
