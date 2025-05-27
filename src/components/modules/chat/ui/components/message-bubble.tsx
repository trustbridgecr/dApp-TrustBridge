"use client";

import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] space-y-1")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm break-words",
            isUser
              ? "bg-emerald-600 text-white rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md",
          )}
        >
          {message.content}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground px-1",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          <span>{message.timestamp}</span>
          {isUser && (
            <span
              className={cn(
                "flex items-center",
                message.status === "read"
                  ? "text-blue-500"
                  : "text-muted-foreground",
              )}
            >
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
