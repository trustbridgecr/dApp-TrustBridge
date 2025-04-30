import { Notification } from "@/@types/notification";
import { NextRequest, NextResponse } from "next/server";

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to TrustBridge",
    message: "Thank you for joining TrustBridge. Start exploring our features!",
    timestamp: new Date().toISOString(),
    type: "info",
    isRead: false,
  },
  {
    id: "2",
    title: "New Transaction",
    message: "You have received 100 XLM from alice*stellar.org",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "success",
    action: {
      label: "View Transaction",
      url: "/transactions/xyz",
    },
    isRead: false,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(mockNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
