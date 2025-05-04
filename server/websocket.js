import { createServer } from "net";
import { v4 as uuidv4 } from "uuid";
import { WebSocket, WebSocketServer } from "ws";

const DEFAULT_PORT = 3001;
const MAX_PORT_ATTEMPTS = 10;
const NOTIFICATION_INTERVAL = parseInt(
  process.env.NOTIFICATION_INTERVAL || "30000",
); // 30 seconds default

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_CONNECTIONS_PER_WINDOW = 5;
const ipConnectionCounts = new Map();

// Notification templates for more meaningful messages
const notificationTemplates = [
  {
    type: "info",
    title: "Bridge Status Update",
    message:
      "Your bridge transfer is being processed. Estimated completion time: {time}",
  },
  {
    type: "success",
    title: "Transaction Complete",
    message:
      "Your transaction has been successfully processed. Transaction ID: {txId}",
  },
  {
    type: "warning",
    title: "Network Congestion",
    message:
      "The network is currently experiencing high congestion. Your transaction may take longer than usual.",
  },
  {
    type: "error",
    title: "Transaction Failed",
    message:
      "Your transaction could not be processed. Please try again or contact support.",
  },
];

let wss;
let currentPort;

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port++) {
    try {
      await new Promise((resolve, reject) => {
        const server = createServer();
        server.once("error", (err) => {
          if (err.code === "EADDRINUSE") {
            resolve(false);
          } else {
            reject(err);
          }
        });
        server.once("listening", () => {
          server.close();
          resolve(true);
        });
        server.listen(port);
      });
      return port;
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
    }
  }
  throw new Error(
    `No available ports found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}`,
  );
}

function startServer() {
  const startPort = parseInt(process.env.WS_PORT || DEFAULT_PORT);

  findAvailablePort(startPort)
    .then((port) => {
      currentPort = port;
      wss = new WebSocketServer({ port });
      console.log(`WebSocket server is running on port ${port}`);

      wss.on("connection", handleConnection);
      wss.on("error", handleServerError);

      // Handle graceful shutdown
      process.on("SIGTERM", gracefulShutdown);
      process.on("SIGINT", gracefulShutdown);
    })
    .catch((error) => {
      console.error("Failed to start WebSocket server:", error);
      process.exit(1);
    });
}

function gracefulShutdown() {
  console.log("Shutting down WebSocket server...");
  if (wss) {
    wss.close(() => {
      console.log("WebSocket server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

function handleServerError(error) {
  console.error("WebSocket server error:", error);
}

function handleConnection(ws, req) {
  console.log("New client connection attempt");

  // Get client IP for rate limiting
  const ip = req.socket.remoteAddress;

  // Check rate limit
  if (!checkRateLimit(ip)) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    ws.close(1008, "Too many connection attempts. Please try again later.");
    return;
  }

  // Extract address from URL query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const address = url.searchParams.get("address");

  if (!address) {
    console.log("No address provided, closing connection");
    ws.close(1008, "Address is required");
    return;
  }

  console.log(`Client connected with address: ${address}`);

  // Send initial notification
  const welcomeNotification = {
    id: uuidv4(),
    title: "Welcome to TrustBridge",
    message: `Thank you for connecting to the notification service! Your address: ${address}`,
    timestamp: new Date().toISOString(),
    type: "info",
    isRead: false,
    address: address,
  };

  if (!safeSend(ws, welcomeNotification)) {
    console.log("Failed to send welcome notification - connection not ready");
    return;
  }

  // Set up interval to send notifications
  const interval = setInterval(() => {
    const notification = generateNotification(address);

    if (!safeSend(ws, notification)) {
      console.log("Failed to send notification - connection not ready");
      clearInterval(interval);
      return;
    }
  }, NOTIFICATION_INTERVAL);

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
    clearInterval(interval);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(interval);
  });
}

function checkRateLimit(ip) {
  const now = Date.now();
  const connectionData = ipConnectionCounts.get(ip);

  if (!connectionData) {
    ipConnectionCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset counter if window has passed
  if (now - connectionData.timestamp > RATE_LIMIT_WINDOW) {
    ipConnectionCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Check if limit exceeded
  if (connectionData.count >= MAX_CONNECTIONS_PER_WINDOW) {
    return false;
  }

  // Increment counter
  connectionData.count++;
  return true;
}

function generateNotification(address) {
  const template =
    notificationTemplates[
      Math.floor(Math.random() * notificationTemplates.length)
    ];
  const txId = uuidv4().slice(0, 8);
  const time = new Date(Date.now() + 300000).toLocaleTimeString(); // 5 minutes from now

  return {
    id: uuidv4(),
    title: template.title,
    message: template.message.replace("{txId}", txId).replace("{time}", time),
    timestamp: new Date().toISOString(),
    type: template.type,
    isRead: false,
    address: address,
  };
}

function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    return true;
  }
  return false;
}

// Start the server
startServer();
