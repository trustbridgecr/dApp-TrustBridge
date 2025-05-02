"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Chat, Message, ChatState } from "@/@types/chat.entity";
import Loader from "@/components/utils/ui/Loader";
import { MessageBubble } from "../components/message-bubble";

const mockChats: Chat[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
    lastMessage: "Hey, how are you?",
    unread: 2,
    status: "online",
    messages: [
      {
        id: "1",
        content: "Hey, how are you?",
        sender: "other",
        timestamp: "10:30 AM",
        status: "read",
      },
      {
        id: "2",
        content: "I'm good, thanks! How about you?",
        sender: "user",
        timestamp: "10:32 AM",
        status: "read",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://github.com/shadcn.png",
    lastMessage: "Can we discuss the loan terms?",
    unread: 0,
    status: "offline",
    lastSeen: "2 hours ago",
    messages: [
      {
        id: "1",
        content: "Can we discuss the loan terms?",
        sender: "other",
        timestamp: "9:15 AM",
        status: "delivered",
      },
    ],
  },
];

export function ChatWindow() {
  const [state, setState] = useState<ChatState>({
    isLoading: false,
    error: null,
    chats: mockChats,
    activeChat: mockChats[0],
  });
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.activeChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !state.activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };

    // Update active chat with new message
    const updatedChat = {
      ...state.activeChat,
      messages: [...state.activeChat.messages, newMessage],
    };

    // Update chats list
    const updatedChats = state.chats.map((chat) =>
      chat.id === updatedChat.id ? updatedChat : chat,
    );

    setState((prev) => ({
      ...prev,
      chats: updatedChats,
      activeChat: updatedChat,
    }));

    setMessage("");

    // Simulate message being sent with error handling
    setTimeout(() => {
      try {
        if (Math.random() < 0.2) {
          throw new Error("Failed to send message");
        }

        const sentMessage = { ...newMessage, status: "sent" as const };
        const updatedChatWithSent = {
          ...updatedChat,
          messages: updatedChat.messages.map((msg) =>
            msg.id === newMessage.id ? sentMessage : msg,
          ),
        };

        setState((prev) => ({
          ...prev,
          chats: prev.chats.map((chat) =>
            chat.id === updatedChatWithSent.id ? updatedChatWithSent : chat,
          ),
          activeChat: updatedChatWithSent,
        }));

        setTimeout(() => {
          const deliveredMessage = {
            ...sentMessage,
            status: "delivered" as const,
          };
          const updatedChatWithDelivered = {
            ...updatedChatWithSent,
            messages: updatedChatWithSent.messages.map((msg) =>
              msg.id === sentMessage.id ? deliveredMessage : msg,
            ),
          };

          setState((prev) => ({
            ...prev,
            chats: prev.chats.map((chat) =>
              chat.id === updatedChatWithDelivered.id
                ? updatedChatWithDelivered
                : chat,
            ),
            activeChat: updatedChatWithDelivered,
          }));
        }, 1000);
      } catch (error: unknown) {
        console.error("Error sending message:", error);
        const errorMessage = { ...newMessage, status: "error" as const };
        const updatedChatWithError = {
          ...updatedChat,
          messages: updatedChat.messages.map((msg) =>
            msg.id === newMessage.id ? errorMessage : msg,
          ),
        };
        setState((prev) => ({
          ...prev,
          chats: prev.chats.map((chat) =>
            chat.id === updatedChatWithError.id ? updatedChatWithError : chat,
          ),
          activeChat: updatedChatWithError,
        }));
      }
    }, 1000);
  };

  if (state.isLoading) {
    return <Loader isLoading={state.isLoading} />;
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{state.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full bg-[#151515]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border  rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Chat List */}
      <div
        className={cn(
          "w-80 border-r flex flex-col bg-[#151515]",
          "fixed lg:relative h-full z-40",
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold dark:text-white text-gray-900">
            Chats
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {state.chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-[#222]",
                state.activeChat?.id === chat.id && "bg-[#212121]",
              )}
              onClick={() => {
                setState((prev) => ({ ...prev, activeChat: chat }));
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={chat.avatar}
                    alt={`${chat.name}'s avatar`}
                  />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate dark:text-white text-gray-900">
                    {chat.name}
                  </p>
                  <span className="text-xs dark:text-gray-400 text-gray-500">
                    {chat.messages[chat.messages.length - 1]?.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm truncate dark:text-gray-400 text-gray-600">
                    {chat.lastMessage}
                  </p>
                  {chat.status === "offline" && chat.lastSeen && (
                    <span className="text-xs text-gray-400">
                      · {chat.lastSeen}
                    </span>
                  )}
                </div>
              </div>
              {chat.unread > 0 && (
                <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-emerald-600 rounded-full">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#151515] lg:pl-0 pl-12">
        {state.activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={state.activeChat.avatar}
                    alt={`${state.activeChat.name}'s avatar`}
                  />
                  <AvatarFallback>{state.activeChat.name[0]}</AvatarFallback>
                </Avatar>
                {state.activeChat.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2" />
                )}
              </div>
              <div>
                <h3 className="font-medium dark:text-white text-gray-900">
                  {state.activeChat.name}
                </h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">
                  {state.activeChat.status === "online"
                    ? "Online"
                    : state.activeChat.lastSeen
                      ? `Last seen ${state.activeChat.lastSeen}`
                      : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {state.activeChat.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-[#222] border text-white placeholder:text-white focus:ring-emerald-600 focus:border-emerald-600"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
