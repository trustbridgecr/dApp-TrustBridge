import { useRouter, useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatWithMessages } from "@/@types/chat.entity";
import { formatAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUserData } from "../../lib/chat";
import { UserChatData } from "@/@types/user.entity";

interface ChatListProps {
  chats: ChatWithMessages[];
  currentWallet: string;
  loading: boolean;
}

export function ChatList({ chats, currentWallet, loading }: ChatListProps) {
  const router = useRouter();
  const { wallet: activeWallet } = useParams();
  const [userData, setUserData] = useState<Record<string, UserChatData>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      const newUserData: Record<string, UserChatData> = {};

      for (const chat of chats) {
        const otherParticipant = chat.participants.find(
          (p) => p !== currentWallet,
        );

        if (otherParticipant && !userData[otherParticipant]) {
          const data = await getUserData(otherParticipant);
          newUserData[otherParticipant] = data;
        }
      }

      setUserData((prev) => ({ ...prev, ...newUserData }));
    };

    if (chats.length > 0) {
      fetchUserData();
    }
  }, [chats, currentWallet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col justify-center mt-5 text-center p-4">
        <p className="text-muted-foreground">
          No chats yet. Start a new conversation by entering a wallet address
          above.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="space-y-2 mt-5">
        {chats.map((chat) => {
          const otherParticipant = chat.participants.find(
            (p) => p !== currentWallet,
          );
          const lastMessageTime = chat.lastMessageTime
            ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;
          const isActive = otherParticipant === activeWallet;
          const user = userData[otherParticipant || ""];

          return (
            <Card
              key={chat.id}
              className={cn(
                "p-3 cursor-pointer transition-colors",
                isActive
                  ? "border-emerald-800 hover:border-emerald-800"
                  : "hover:bg-muted/50",
              )}
              onClick={() => router.push(`/dashboard/chat/${otherParticipant}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${otherParticipant}.svg`} // todo: you can add profile image of the users in firebase, and then use it here
                    alt={`Avatar for ${otherParticipant}`}
                  />
                  <AvatarFallback className="bg-emerald-800 text-emerald-800">
                    {user?.firstName?.slice(0, 2).toUpperCase() ||
                      otherParticipant?.slice(0, 2).toUpperCase()}
                    {user?.lastName?.slice(0, 2).toUpperCase() ||
                      otherParticipant?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className={cn("font-medium truncate")}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatAddress(otherParticipant || "")}
                      </p>
                    </div>
                    {lastMessageTime && (
                      <span className={cn("text-xs")}>{lastMessageTime}</span>
                    )}
                  </div>
                  <p className={cn("text-sm truncate text-muted-foreground")}>
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
