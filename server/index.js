const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let currentNumber = 1;
let currentWindow = 1;
const MAX_NUMBER = 100;

io.on("connection", (socket) => {
  console.log("User connected");

  // Send current state
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  // Admin triggers next number
  socket.on("nextNumber", () => {
    currentNumber = currentNumber >= MAX_NUMBER ? 1 : currentNumber + 1;

    // Example: rotate windows (1–3)
    currentWindow = currentWindow >= 3 ? 1 : currentWindow + 1;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});