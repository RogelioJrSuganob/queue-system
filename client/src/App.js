import React, { useEffect, useState } from "react";
import "./App.css";
import Admin from "./Admin";
import Customer from "./Customer";
import TVDisplay from "./TVDisplay";
import { socket } from "./socket";

function App() {
  const [view, setView] = useState("customer");
  const [queue, setQueue] = useState({ number: 1, window: 1 });

  useEffect(() => {
    socket.on("queueUpdate", (data) => {
      setQueue(data);
    });

    return () => socket.off("queueUpdate");
  }, []);

  return (
    <div className="app">
      <div className="nav">
        {["customer", "admin", "tv"].map((v) => (
          <button
            key={v}
            className={view === v ? "active" : ""}
            onClick={() => setView(v)}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="page">
        {view === "admin" && <Admin queue={queue} />}
        {view === "customer" && <Customer queue={queue} />}
        {view === "tv" && <TVDisplay queue={queue} />}
      </div>
    </div>
  );
}

export default App;