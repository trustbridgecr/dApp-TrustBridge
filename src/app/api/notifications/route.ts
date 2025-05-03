import { Notification } from "@/@types/notification";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

const notificationTemplates = [
  {
    title: "Transaction Completed",
    message:
      "Your transfer of {amount} {currency} to {recipient} has been completed successfully.",
    type: "success" as const,
    action: {
      label: "View Transaction",
      url: "/transactions/{txId}",
    },
  },
  {
    title: "Bridge Activity",
    message:
      "Bridge transfer of {amount} {currency} from {sourceChain} to {targetChain} is in progress.",
    type: "info" as const,
    action: {
      label: "Track Status",
      url: "/bridge/{bridgeId}",
    },
  },
  {
    title: "Security Alert",
    message:
      "New device login detected from {location}. If this wasn't you, please secure your account.",
    type: "warning" as const,
    action: {
      label: "Review Activity",
      url: "/security/activity",
    },
  },
  {
    title: "Bridge Complete",
    message:
      "Your bridge transfer of {amount} {currency} has been completed successfully.",
    type: "success" as const,
    action: {
      label: "View Details",
      url: "/bridge/{bridgeId}",
    },
  },
];

function generateRealisticNotification(): Notification {
  const template =
    notificationTemplates[
      Math.floor(Math.random() * notificationTemplates.length)
    ];
  const timestamp = new Date(
    Date.now() - Math.floor(Math.random() * 86400000),
  ).toISOString();

  return {
    id: randomUUID(),
    title: template.title,
    message: template.message,
    timestamp,
    type: template.type,
    action: template.action,
    isRead: false,
  };
}

// Generate a realistic set of notifications
const mockNotifications: Notification[] = Array.from({ length: 20 }, () =>
  generateRealisticNotification(),
);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = ipRequestCounts.get(ip);

  if (!requestData) {
    ipRequestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset counter if window has passed
  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    ipRequestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Check if limit exceeded
  if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Increment counter
  requestData.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  // Validate pagination parameters
  if (page < 1 || size < 1 || size > 100) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 },
    );
  }

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 },
    );
  }

  // Get client IP for rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    // Try to parse localStorage data if available
    const localStorageData = request.headers.get("x-local-storage");

    if (localStorageData) {
      try {
        JSON.parse(localStorageData);
      } catch (parseError) {
        console.warn("Failed to parse localStorage data:", parseError);
        // Continue with default preferences
      }
    }

    // Calculate pagination
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedNotifications = mockNotifications.slice(
      startIndex,
      endIndex,
    );

    return NextResponse.json({
      notifications: paginatedNotifications,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalItems: mockNotifications.length,
        totalPages: Math.ceil(mockNotifications.length / size),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
