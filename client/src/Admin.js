import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Admin({ queue }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [windows, setWindows] = useState([]);
  const [inputWindow, setInputWindow] = useState("");
  const [manualNumber, setManualNumber] = useState("");

  // 🔒 AUTH
  useEffect(() => {
    const saved = localStorage.getItem("adminAuth");
    if (saved === "true") setAuthorized(true);
  }, []);

  // 🔄 WINDOW SYNC (FIXED)
  useEffect(() => {
    const handleWindows = (data) => {
      setWindows(data);
    };

    socket.on("windowsUpdate", handleWindows);

    // 🔥 REQUEST WINDOWS AFTER CONNECT
    socket.emit("requestWindows");

    return () => socket.off("windowsUpdate", handleWindows);
  }, []);

  const handleLogin = () => {
    socket.emit("adminLogin", password, (res) => {
      if (res.success) {
        setAuthorized(true);
        localStorage.setItem("adminAuth", "true");
      } else {
        alert("Wrong password");
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setAuthorized(false);
  };

  const next = (windowNumber) => {
    socket.emit("nextNumber", windowNumber);
  };

  const reset = () => {
    socket.emit("resetQueue");
  };

  const addWindow = () => {
    const num = Number(inputWindow);
    if (!num) return alert("Enter valid number");

    socket.emit("addWindow", num);
    setInputWindow("");
  };

  const removeWindow = () => {
    const num = Number(inputWindow);
    if (!num) return alert("Enter valid number");

    socket.emit("removeWindow", num);
    setInputWindow("");
  };

  const setNumber = () => {
    const num = Number(manualNumber);
    if (!num) return alert("Enter valid number");

    socket.emit("setNumber", num);
    setManualNumber("");
  };

  if (!authorized) {
    return (
      <div className="page">
        <div className="card">
          <h1>Admin Login</h1>

          <input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          <button
            className="btn secondary"
            onClick={() => setShow(!show)}
          >
            {show ? "🙈 Hide Password" : "👁 Show Password"}
          </button>

          <button className="btn primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Panel</h1>

        <div className="big">{queue.number ?? "--"}</div>
        <div className="window">Window {queue.window ?? "--"}</div>

        {/* WINDOWS */}
        <div className="admin-grid">
          {windows.map((w) => (
            <button
              key={w}
              className="btn primary"
              onClick={() => next(w)}
            >
              Window {w}
            </button>
          ))}
        </div>

        {/* INPUT CONTROL */}
        <div className="control-row">
          <input
            type="number"
            placeholder="Window #"
            value={inputWindow}
            onChange={(e) => setInputWindow(e.target.value)}
          />

          <button className="btn primary" onClick={addWindow}>
            ➕ Add
          </button>

          <button className="btn secondary" onClick={removeWindow}>
            ➖ Remove
          </button>
        </div>

        <div className="control-row">
          <input
            type="number"
            placeholder="Set Number"
            value={manualNumber}
            onChange={(e) => setManualNumber(e.target.value)}
          />

          <button className="btn primary" onClick={setNumber}>
            ✏️ Set
          </button>
        </div>

        <button className="btn secondary" onClick={reset}>
          🔄 Reset
        </button>

        <button className="btn secondary" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}