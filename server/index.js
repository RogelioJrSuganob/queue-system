const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const ADMIN_PASSWORD = "admin123";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 STATE
let currentNumber = null;
let currentWindow = null;
let windows = [1, 2, 3];

io.on("connection", (socket) => {
  console.log("User connected");

  // ✅ INITIAL DATA
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  socket.emit("windowsUpdate", windows);

  // 🔁 REQUEST WINDOWS (refresh fix)
  socket.on("requestWindows", () => {
    socket.emit("windowsUpdate", windows);
  });

  // 🔐 ADMIN LOGIN (SECURE)
  socket.on("adminLogin", (inputPassword, callback) => {
    if (inputPassword === ADMIN_PASSWORD) {
      callback({ success: true });
    } else {
      callback({ success: false });
    }
  });

  // ➕ ADD WINDOW
  socket.on("addWindow", (num) => {
    if (!Number.isInteger(num) || num < 1) return;

    if (!windows.includes(num)) {
      windows.push(num);
      windows.sort((a, b) => a - b);

      io.emit("windowsUpdate", windows);
    }
  });

  // ➖ REMOVE WINDOW
  socket.on("removeWindow", (num) => {
    if (!Number.isInteger(num) || num < 1) return;

    windows = windows.filter((w) => w !== num);

    // 🔥 FIX: reset if active window removed
    if (currentWindow === num) {
      currentWindow = null;
    }

    io.emit("windowsUpdate", windows);

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });

  // 🔢 NEXT NUMBER
  socket.on("nextNumber", (windowNumber) => {
    if (!windows.includes(windowNumber)) return;

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

  // 🔄 RESET QUEUE
  socket.on("resetQueue", () => {
    currentNumber = null;
    currentWindow = null;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });

  // ✏️ SET NUMBER + WINDOW
  socket.on("setNumber", (data) => {
    const { number, window } = data;

    // ✅ VALIDATE NUMBER
    if (
      !Number.isInteger(number) ||
      number < 1 ||
      number > 100
    ) {
      return;
    }

    // ✅ VALIDATE WINDOW
    if (!Number.isInteger(window) || window < 1) {
      return;
    }

    if (!windows.includes(window)) {
      return;
    }

    currentNumber = number;
    currentWindow = window;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});