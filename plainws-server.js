const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Event listener for WebSocket connections
wss.on('connection', (ws) => {
  // Event listener for receiving messages
  ws.on('message', (message) => {
    // Handle the received message
    console.log('Received message:', message);

    // Example: Echo the received message back to the client
    ws.send(message);
  });

  // Event listener for WebSocket disconnections
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

console.log('WebSocket server is running on port 8080');