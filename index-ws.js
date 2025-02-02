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
