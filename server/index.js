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

// STATE
let currentNumber = null;
let currentWindow = null;
let windows = [1, 2, 3];

io.on("connection", (socket) => {
  console.log("User connected");

  // ✅ SEND INITIAL STATE
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  socket.emit("windowsUpdate", windows);

  // 🔁 REQUEST WINDOWS (FIX FOR REFRESH)
  socket.on("requestWindows", () => {
    socket.emit("windowsUpdate", windows);
  });

  // ➕ ADD WINDOW (CUSTOM NUMBER)
  socket.on("addWindow", (num) => {
    if (!num) return;

    if (!windows.includes(num)) {
      windows.push(num);
      windows.sort((a, b) => a - b);
      io.emit("windowsUpdate", windows);
    }
  });

  // ➖ REMOVE WINDOW
  socket.on("removeWindow", (num) => {
    windows = windows.filter((w) => w !== num);
    io.emit("windowsUpdate", windows);
  });

  // 🔢 NEXT NUMBER
  socket.on("nextNumber", (windowNumber) => {
    if (currentNumber === null) {
      currentNumber = 1;
    } else {
      currentNumber =
        currentNumber >= 100 ? 1 : currentNumber + 1;
    }

    currentWindow = windowNumber;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });

  // 🔄 RESET
  socket.on("resetQueue", () => {
    currentNumber = null;
    currentWindow = null;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});