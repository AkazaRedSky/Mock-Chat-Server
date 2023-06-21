const WebSocket = require("ws");

// Create New Websocket Server
const wss = new WebSocket.Server({ port: 8080 });

// Define Variables

// Connected User List
const connectedUsers = new Map();
// Saved Message Lists
const sentMessages = [];

// Define Functions

// Broadcast Function
const broadcastMessage = (message) => {
   wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
         client.send(JSON.stringify(message));
      }
   });
};

// Event Listener for WebSocket connections
wss.on("connection", (ws) => {
   // Add user to the list of connected users
   connectedUsers.set(ws, `User-${connectedUsers.size + 1}`);
   broadcastMessage(`Number of connected users: ${connectedUsers.size}`);
   
   // Send a welcome message and old messages to the newly connected user
   ws.send(JSON.stringify({ message: "Welcome!!!" }));
   sentMessages.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

   // Broadcast the updated number of connected users
   ws.on("message", (message) => {
      // Handle received message from the user
      console.log("Received message:", JSON.parse(message));

      // Check if the message is a JSON object
      let parsedMessage;
      try {
         parsedMessage = JSON.parse(message);
         sentMessages.push(parsedMessage);
      } catch (error) {
         console.log("Invalid message format:", error);
         return;
      }
      // Broadcast the message to all user
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
