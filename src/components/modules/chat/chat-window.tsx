"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Menu } from "lucide-react";
import { useState } from "react";
import { Chat, Message, ChatState } from "./types";
import { LoadingState } from "./components/loading-state";
import { ErrorState } from "./components/error-state";
import { MessageBubble } from "./components/message-bubble";

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

    // Simulate message being sent
    setTimeout(() => {
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

      // Simulate message being delivered
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
    }, 1000);
  };

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (state.error) {
    return (
      <ErrorState
        message={state.error}
        onRetry={() => setState((prev) => ({ ...prev, error: null }))}
      />
    );
  }

  return (
    <div className="flex h-screen w-full">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border dark:border-[#1E3A5F] rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Chat List */}
      <div
        className={cn(
          "w-80 border-r dark:border-[#1E3A5F] border-gray-200 flex flex-col bg-background",
          "fixed lg:relative h-full z-40",
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-4 border-b dark:border-[#1E3A5F] border-gray-200">
          <h2 className="text-lg font-semibold dark:text-white text-gray-900">
            Chats
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {state.chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1E3A5F]/50",
                state.activeChat?.id === chat.id &&
                  "bg-gray-100 dark:bg-[#1E3A5F]/50",
              )}
              onClick={() => {
                setState((prev) => ({ ...prev, activeChat: chat }));
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
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
                <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#00FFFF] rounded-full">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-background lg:pl-0 pl-12">
        {state.activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b dark:border-[#1E3A5F] border-gray-200">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={state.activeChat.avatar} />
                  <AvatarFallback>{state.activeChat.name[0]}</AvatarFallback>
                </Avatar>
                {state.activeChat.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
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
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-[#1E3A5F] border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF]"
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
