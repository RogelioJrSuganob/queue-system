import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Admin({ queue }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [windows, setWindows] = useState([]);

  // 🔒 Remember login
  useEffect(() => {
    const saved = localStorage.getItem("adminAuth");
    if (saved === "true") setAuthorized(true);
  }, []);

  // 📡 Listen for window updates
  useEffect(() => {
    socket.on("windowsUpdate", (data) => {
      setWindows(data);
    });

    return () => socket.off("windowsUpdate");
  }, []);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthorized(true);
      localStorage.setItem("adminAuth", "true");
    } else {
      alert("Wrong password");
    }
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
    socket.emit("addWindow");
  };

  const removeWindow = (w) => {
    socket.emit("removeWindow", w);
  };

  // ⌨ ENTER KEY
  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // 🔐 LOGIN UI
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
            onKeyDown={handleKey}
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

  // ✅ ADMIN PANEL
  return (
    <div className="page">
      <div className="card">
        <h1>Admin Panel</h1>

        <div className="big">{queue.number ?? "--"}</div>
        <div className="window">Window {queue.window ?? "--"}</div>

        {/* WINDOWS */}
        <div className="admin-grid">
          {windows.map((w) => (
            <div key={w} style={{ display: "flex", gap: "6px" }}>
              <button
                className="btn primary"
                onClick={() => next(w)}
              >
                Window {w}
              </button>

              <button
                className="btn secondary"
                onClick={() => removeWindow(w)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <button className="btn primary" onClick={addWindow}>
          ➕ Add Window
        </button>

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