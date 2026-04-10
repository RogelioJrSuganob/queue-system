const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Queue System Backend Running 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let currentNumber = 1;
let currentWindow = 1;

io.on("connection", (socket) => {
  socket.emit("queueUpdate", {
    number: currentNumber,
    window: currentWindow,
  });

  socket.on("nextNumber", (windowNumber) => {
    currentNumber = currentNumber >= 100 ? 1 : currentNumber + 1;
    currentWindow = windowNumber || currentWindow;

    io.emit("queueUpdate", {
      number: currentNumber,
      window: currentWindow,
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

