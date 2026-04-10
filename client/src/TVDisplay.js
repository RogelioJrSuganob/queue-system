import React, { useEffect, useState } from "react";
import { socket } from "./socket";

export default function TVDisplay() {
  const [data, setData] = useState({ number: 1, window: 1 });

  useEffect(() => {
    socket.on("queueUpdate", setData);
    return () => socket.off("queueUpdate");
  }, []);

  return (
    <div style={{ textAlign: "center", fontSize: "50px" }}>
      <h1>NOW SERVING</h1>
      <div>{data.number}</div>
      <div>WINDOW {data.window}</div>
    </div>
  );
}