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
server.listen(3000, function () {
  console.log("server started on port 3000. Amazing.");
});

/** Begin websocket */
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numOfClients = wss.clients.size;
  console.log("Clients connected: ", numOfClients);

  wss.broadcast(`Current visitors: ${numOfClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", function close() {
    console.log("A client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
