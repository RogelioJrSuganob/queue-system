import React, { useEffect, useState } from "react";

export default function Customer({ queue }) {
  const [myNumber, setMyNumber] = useState(() => {
    return localStorage.getItem("myNumber") || "";
  });

  const [status, setStatus] = useState("Waiting...");

  // Save to localStorage
  useEffect(() => {
    if (myNumber) {
      localStorage.setItem("myNumber", myNumber);
    }
  }, [myNumber]);

  // Update status when queue changes
  useEffect(() => {
    if (!myNumber) return;

    const diff = myNumber - queue.number;

    if (diff === 0) {
      setStatus(`👉 It's your turn! Go to Window ${queue.window}`);
      playSound();
    } else if (diff > 0 && diff <= 5) {
      setStatus("⚠️ You're almost up!");
    } else {
      setStatus("Waiting...");
    }
  }, [queue, myNumber]);

  const playSound = () => {
    const audio = new Audio("/ding.mp3");
    audio.play();
  };

  const handleChange = (e) => {
    setMyNumber(Number(e.target.value));
  };

  const clearNumber = () => {
    localStorage.removeItem("myNumber");
    setMyNumber("");
    setStatus("Waiting...");
  };

  return (
    <div className="customer">
      <h1>Queue Monitor</h1>

      <div className="card highlight">
        <div className="big">{queue.number}</div>
        <p>Window {queue.window}</p>
      </div>

      <input
        type="number"
        placeholder="Enter your number"
        value={myNumber}
        onChange={handleChange}
      />

      <div style={{ marginTop: "10px" }}>
        <button className="btn" onClick={clearNumber}>
          Reset My Number
        </button>
      </div>

      <p className="status">{status}</p>
    </div>
  );
}