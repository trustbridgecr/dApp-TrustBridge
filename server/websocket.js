const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = 3001;

console.log("WebSocket server started on port 3001");

wss.on('connection', (ws, req) => {
  console.log('New client connection attempt');

  // Extract address from URL query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const address = url.searchParams.get('address');

  if (!address) {
    console.log('No address provided, closing connection');
    ws.close(1008, 'Address is required');
    return;
  }

  console.log(`Client connected with address: ${address}`);

  // Send initial notification
  const welcomeNotification = {
    id: '1',
    title: 'Welcome to TrustBridge',
    message: 'Thank you for connecting to the notification service!',
    timestamp: new Date().toISOString(),
    type: 'info',
    isRead: false
  };

  console.log('Sending welcome notification:', welcomeNotification);
  ws.send(JSON.stringify(welcomeNotification));

  // Set up interval to send random notifications
  const interval = setInterval(() => {
    const types = ['info', 'success', 'warning', 'error'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New ${randomType} notification`,
      message: `This is a ${randomType} notification sent at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      type: randomType,
      isRead: false
    };

    console.log('Sending random notification:', notification);
    ws.send(JSON.stringify(notification));
  }, 10000); // Send every 10 seconds

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server started on port ${PORT}`);
});
