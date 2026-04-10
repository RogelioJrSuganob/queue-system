import React from "react";
import { socket } from "./socket";

export default function Admin() {
  const next = () => socket.emit("nextNumber");

  return (
    <div>
      <h1>Admin</h1>
      <button onClick={next}>Next Number</button>
    </div>
  );
}