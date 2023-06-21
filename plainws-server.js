const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// List the connected users
const connectedUsers = new Set();

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Event listener for WebSocket connections
wss.on("connection", (ws) => {
  // Add user to the list of connected users
  connectedUsers.set(ws, `User-${connectedUsers.size + 1}`);
  

  // Send a welcome message to the newly connected user
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server" }));
  // Broadcast the updated number of connected users
  ws.on("message", (message) => {
    // Handle received message from the user
    console.log("Received message:", message);
    broadcastMessage(`Number of connected users: ${connectedUsers.size}`);

    // Check if the message is a JSON object
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.log("Invalid message format:", error);
      return;
    }

    // Broadcast the received message to all connected users
    broadcastMessage(parsedMessage);
  });

  ws.on("close", () => {
    // Remove the user from the list of connected users
    connectedUsers.delete(ws);

    // Broadcast the updated number of connected users
    broadcastMessage({ connectedUsers: connectedUsers.size });
  });
});

console.log("WebSocket server is running on port 8080");