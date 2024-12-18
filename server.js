const WebSocket = require('ws'); // Import WebSocket library
const EventEmitter = require('events'); // Import EventEmitter

// EventEmitter instance to handle events
const eventEmitter = new EventEmitter();

// 1. Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});

// 2. Handle client connections
wss.on('connection', (ws) => {
  console.log('A client connected.');

  // Emit 'clientConnected' event
  eventEmitter.emit('clientConnected');

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received:', message);

    // Emit 'messageReceived' event
    eventEmitter.emit('messageReceived', message);

    // Broadcast message to all connected clients
    broadcast(message, ws);
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log('A client disconnected.');
    eventEmitter.emit('clientDisconnected');
  });

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the chat server!');
});

// 3. Broadcast messages to all connected clients
function broadcast(message, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(`Broadcast: ${message}`);
    }
  });
}

// 4. Event Logging
eventEmitter.on('clientConnected', () => {
  console.log('Event: A new client has connected.');
});

eventEmitter.on('messageReceived', (message) => {
  console.log(`Event: Message received -> ${message}`);
});

eventEmitter.on('clientDisconnected', () => {
  console.log('Event: A client has disconnected.');
});
