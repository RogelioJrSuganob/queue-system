import React, { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Admin() {
  const [data, setData] = useState({ number: 1, window: 1 });

  useEffect(() => {
    socket.on("queueUpdate", (update) => {
      setData(update);
    });

    return () => socket.off("queueUpdate");
  }, []);

  const handleNext = () => {
    socket.emit("nextNumber");

    // Play sound
    const audio = new Audio("/ding.mp3");
    audio.play();
  };

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <h2>Now Serving</h2>
      <div className="number">{data.number}</div>
      <h3>Window {data.window}</h3>

      <button onClick={handleNext} className="btn">
        Next Number
      </button>
    </div>
  );
}