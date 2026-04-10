import React, { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Customer() {
  const [data, setData] = useState({ number: 1, window: 1 });
  const [myNumber, setMyNumber] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on("queueUpdate", (update) => {
      setData(update);

      if (myNumber) {
        const diff = myNumber - update.number;

        if (diff === 0) {
          notify("It's your turn!");
          setStatus(`Go to Window ${update.window}`);
        } else if (diff > 0 && diff <= 5) {
          notify("You're almost up!");
          setStatus("Get ready...");
        } else {
          setStatus("Waiting...");
        }
      }
    });

    return () => socket.off("queueUpdate");
  }, [myNumber]);

  const notify = (message) => {
    const audio = new Audio("/ding.mp3");
    audio.play();

    if (Notification.permission === "granted") {
      new Notification(message);
    }
  };

  const requestPermission = () => {
    Notification.requestPermission();
  };

  return (
    <div className="container">
      <h1>Queue Monitor</h1>

      <div className="display">
        <h2>Now Serving</h2>
        <div className="number">{data.number}</div>
        <h3>Window {data.window}</h3>
      </div>

      <input
        type="number"
        placeholder="Enter your number"
        value={myNumber}
        onChange={(e) => setMyNumber(Number(e.target.value))}
      />

      <button onClick={requestPermission}>Enable Notifications</button>

      <p>{status}</p>
    </div>
  );
}