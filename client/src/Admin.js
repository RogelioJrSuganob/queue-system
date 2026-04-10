import React from "react";
import { socket } from "./socket";

export default function Admin({ queue }) {
  const next = (w) => socket.emit("nextNumber", w);

  return (
    <div className="page">
      <div className="card">
        <div className="big">{queue.number}</div>
        <div className="window">Window {queue.window}</div>
      </div>

      <div className="grid admin-grid">
        {[1,2,3].map(w => (
          <button key={w} className="btn primary" onClick={() => next(w)}>
            Window {w}
          </button>
        ))}
      </div>
    </div>
  );
}