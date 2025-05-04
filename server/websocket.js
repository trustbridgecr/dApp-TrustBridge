const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.WS_PORT || 3001;
const NOTIFICATION_INTERVAL = parseInt(
  process.env.NOTIFICATION_INTERVAL || "30000",
); // 30 seconds default

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on port ${PORT}`);

wss.on("connection", (ws, req) => {
  console.log("New client connection attempt");

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

  console.log("Sending welcome notification:", welcomeNotification);
  ws.send(JSON.stringify(welcomeNotification));

  // Set up interval to send random notifications
  const interval = setInterval(() => {
    const types = ["info", "success", "warning", "error"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const notification = {
      id: uuidv4(),
      title: `New ${randomType} notification`,
      message: `This is a ${randomType} notification for address ${address} sent at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      type: randomType,
      isRead: false,
      address: address,
    };

    console.log("Sending random notification:", notification);
    ws.send(JSON.stringify(notification));
  }, NOTIFICATION_INTERVAL);

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
    clearInterval(interval);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
