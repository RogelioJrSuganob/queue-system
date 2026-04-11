import { io } from "socket.io-client";

   export const socket = io("https://queue-system-bank.onrender.com");
// or local:
// export const socket = io("http://localhost:5000");