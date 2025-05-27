import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../lib/chat";

type ChatMessage = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  status?: string;
};

export const useChat = (walletA: string, walletB: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const loadMessages = async () => {
    const msgs = await fetchMessages(walletA, walletB);
    setMessages(msgs);
  };

  const handleSend = async (message: string) => {
    await sendMessage(walletA, walletB, message);
    await loadMessages();
  };

  useEffect(() => {
    loadMessages();
  }, [walletA, walletB]);

  return { messages, handleSend };
};
