import React from "react";
import { socket } from "./socket";

export default function Admin({ queue }) {
  const next = (windowNumber) => {
    socket.emit("nextNumber", windowNumber);
  };

  const reset = () => {
    socket.emit("resetQueue");
  };

  return (
    <div className="card">
      <h1>Admin Panel</h1>

      <div className="card">
        <h2>Now Serving</h2>
        <div className="big">{queue.number}</div>
        <p className="window">Window {queue.window}</p>
      </div>

      <div className="grid admin-grid">
        {[1, 2, 3].map((w) => (
          <button key={w} className="btn primary" onClick={() => next(w)}>
            Call Window {w}
          </button>
        ))}
      </div>

      <button className="btn secondary" onClick={reset}>
        🔄 Reset Queue
      </button>
    </div>
  );
}