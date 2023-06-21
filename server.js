const http = require('http');
const socketIO = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('Server is running');
});

// Create a Socket.IO instance
const io = socketIO(server);

// Event handler for new socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Event handler for receiving new messages
  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);

    // Broadcast the message to all connected clients
    io.emit('messageReceived', data);
  });

  // Event handler for disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});