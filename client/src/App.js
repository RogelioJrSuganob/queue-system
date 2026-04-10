import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import Customer from "./Customer";
import TVDisplay from "./TVDisplay";
import { socket } from "./socket";

function App() {
  const [queue, setQueue] = useState(null);

  useEffect(() => {
    socket.on("queueUpdate", (data) => {
      setQueue(data);
    });

    return () => socket.off("queueUpdate");
  }, []);

  if (!queue) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Customer queue={queue} />} />
        <Route path="/admin" element={<Admin queue={queue} />} />
        <Route path="/tv" element={<TVDisplay queue={queue} />} />
      </Routes>
    </Router>
  );
}

export default App;