import React, { useEffect, useState } from "react";
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
    <div>
      <div className="nav">
        <button onClick={() => setView("customer")}>Customer</button>
        <button onClick={() => setView("admin")}>Admin</button>
        <button onClick={() => setView("tv")}>TV</button>
      </div>

      {view === "admin" && <Admin queue={queue} />}
      {view === "customer" && <Customer queue={queue} />}
      {view === "tv" && <TVDisplay queue={queue} />}
    </div>
  );
}

export default App;