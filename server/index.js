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

// QUEUE STATE
let currentNumber = null;
let currentWindow = null;
let lastIssuedNumber = 1;

// WINDOWS STATE (REAL-TIME)
let windows = [1, 2, 3];

io.on("connection", (socket) => {
  console.log("User connected");

  // SEND INITIAL DATA
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  socket.emit("windowsUpdate", windows);

  // ➕ ADD WINDOW
  socket.on("addWindow", () => {
    const next =
      windows.length > 0 ? Math.max(...windows) + 1 : 1;

    windows.push(next);

    io.emit("windowsUpdate", windows);
  });

  // ❌ REMOVE WINDOW
  socket.on("removeWindow", (w) => {
    windows = windows.filter((win) => win !== w);

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