const express = require("express");
const server = require("http").createServer();
const app = express();

// create a route
app.get("/", function (req, res) {
  // __dirname is a reserverd word, as shorthand for specifying the current directory
  res.sendFile("index.html", { root: __dirname });
});

// make the server respond the requests
server.on("request", app);

// create a listener
server.listen(3000, function () {
  console.log("server started on port 3000. Amazing.");
});

/** Begin websocket */
const WebSocketServer = require("ws").Server;

// create websocket patched to our express server
const wss = new WebSocketServer({ server: server });

// create function called "connection" that will run
// every time a user connects to a new server
wss.on("connection", function connection(ws) {
  // hier we write what we want to happen every time someone connects
  const numOfClients = wss.clients.size;
  console.log("Clients connected: ", numOfClients);

  // broadcast will sent the message to every connected client
  wss.broadcast(`Broadcasting Current visitors: ${numOfClients}`);

  // readyState gives you the current state of the ws
  if (ws.readyState === ws.OPEN) {
    // send message to THAT ONE CLIENT that is connected
    ws.send("Welcome to my server");
  }

  // a socket can be "open", "closed" or "errored"
  ws.on("close", function close() {
    // broadcast to all the clients
    wss.broadcast(
      `A client has disconnected, remaining visitors connected: ${numOfClients}`
    );
    console.log("A client has disconnected");
  });
});

// we need to write the broadcast function. It is not something that exists
// to speak to every client you normally would do webSocket.forEach and iterate...
// but a function will do that for us: we will attach it to wss.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
