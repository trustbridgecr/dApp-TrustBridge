"use client";

import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { Message } from "@/@types/chat.entity";

interface MessageBubbleProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex",
        message.sender === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] md:max-w-[60%] lg:max-w-[50%] rounded-lg p-3",
          message.sender === "user"
            ? "bg-emerald-600 text-white"
            : "bg-[#2D2D2D] text-gray-100",
        )}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs opacity-50">{message.timestamp}</span>
          {message.sender === "user" && getStatusIcon()}
          {message.status === "error" && onRetry && (
            <button
              onClick={() => onRetry(message.id)}
              className="ml-2 text-xs text-red-500 underline hover:text-red-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
