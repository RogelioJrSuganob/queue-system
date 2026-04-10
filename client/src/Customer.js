import React from "react";

export default function Customer({ queue }) {
  return (
    <div className="card">
      <h1>Now Serving</h1>
      <div className="big">{queue.number}</div>
      <div className="window">Window {queue.window}</div>
    </div>
  );
}