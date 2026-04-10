import React from "react";
import { socket } from "./socket";

export default function Admin({ queue }) {
  const next = (windowNumber) => {
    socket.emit("nextNumber", windowNumber);
  };

  return (
    <div className="admin">
      <h1>Admin Panel</h1>

      <div className="card">
        <h2>Now Serving</h2>
        <div className="big">{queue.number}</div>
        <p>Window {queue.window}</p>
      </div>

      <h3>Select Window</h3>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <div className="window-grid">
          {[1, 2, 3].map((w) => (
            <button key={w} className="btn primary" onClick={() => next(w)}>
              Window {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}