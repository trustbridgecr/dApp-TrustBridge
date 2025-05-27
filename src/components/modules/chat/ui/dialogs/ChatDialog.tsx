"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Menu, ArrowLeft, Copy, Check } from "lucide-react";
import { MessageBubble } from "../components/message-bubble";
import { useWalletContext } from "@/providers/wallet.provider";
import { useParams, useRouter } from "next/navigation";
import { useWalletChat } from "../../hooks/wallet-chat.hook";
import { toast } from "sonner";

export function ChatDialog() {
  const { walletAddress } = useWalletContext();
  const { wallet: otherWallet } = useParams();
  const [message, setMessage] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { messages, sendMessage, loading, error } = useWalletChat(
    walletAddress!,
    otherWallet as string,
  );

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartChat = () => {
    if (!targetWallet.trim()) return;
    router.push(`/dashboard/chat/${targetWallet}`);
    setTargetWallet("");
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletAddress || !otherWallet) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8">
          <p className="text-muted-foreground text-center">
            Wallet not connected or invalid target.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full bg-background min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md shadow-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-background max-w-4xl mx-auto">
        {/* New Chat Selector */}
        <Card className="m-4 mb-0">
          <CardHeader className="pb-3">
            <div className="flex gap-2 items-center">
              <Input
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                placeholder="Enter wallet address to start new chat"
                className="flex-1"
              />
              <Button
                onClick={handleStartChat}
                disabled={!targetWallet.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Start Chat
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Chat Card */}
        <Card className="m-4 flex-1 flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${otherWallet}.svg`}
                    alt={`Avatar for ${otherWallet}`}
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {(otherWallet as string).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {formatAddress(otherWallet as string)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyAddress(otherWallet as string)}
                    className="p-1 h-6 w-6"
                  >
                    {copiedAddress ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Wallet Chat
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {messages.length} messages
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[60vh]">
              <div className="p-4 space-y-4">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Send className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Start the conversation
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Send your first message to{" "}
                      {formatAddress(otherWallet as string)} to begin chatting.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={{
                        id: msg.id,
                        content: msg.content,
                        sender: msg.from === walletAddress ? "user" : "other",
                        timestamp: new Date(msg.timestamp).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        ),
                        status: msg.status || "sent",
                      }}
                    />
                  ))
                )}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending}
                  className="pr-12 bg-background border-border focus:ring-emerald-600 focus:border-emerald-600"
                />
                {message.trim() && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    {message.length}/500
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[44px]"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift + Enter for new line</span>
              {error && (
                <span className="text-red-500">Failed to send message</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
