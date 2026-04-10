const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let currentNumber = 1;
let currentWindow = 1;
let lastIssuedNumber = 1;

io.on("connection", (socket) => {
  // Send current queue
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  // Assign number to customer
  socket.on("getNumber", (callback) => {
    const assigned = lastIssuedNumber;
    lastIssuedNumber = lastIssuedNumber >= 100 ? 1 : lastIssuedNumber + 1;
    callback(assigned);
  });

  // Next number
  socket.on("nextNumber", (windowNumber) => {
    if (currentNumber === null) {
      currentNumber = 1;
    } else {
      currentNumber = currentNumber >= 100 ? 1 : currentNumber + 1;
    }

    currentWindow = windowNumber || currentWindow || 1;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });

  // RESET (FIXED)
  socket.on("resetQueue", () => {
    currentNumber = null;
    currentWindow = null;
    lastIssuedNumber = 1;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});