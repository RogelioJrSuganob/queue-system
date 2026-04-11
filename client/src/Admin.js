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

  // 🔄 WINDOW SYNC
  useEffect(() => {
    const handleWindows = (data) => {
      setWindows(data);
    };

    socket.on("windowsUpdate", handleWindows);

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
    if (!Number.isInteger(num) || num < 1) {
      return alert("Enter valid window number");
    }

    socket.emit("addWindow", num);
    setInputWindow("");
  };

  const removeWindow = () => {
    const num = Number(inputWindow);
    if (!Number.isInteger(num) || num < 1) {
      return alert("Enter valid window number");
    }

    socket.emit("removeWindow", num);
    setInputWindow("");
  };

  const setNumber = () => {
    const num = Number(manualNumber);
    const win = Number(inputWindow);

    if (!Number.isInteger(num) || num < 1 || num > 100) {
      return alert("Number must be 1–100");
    }

    if (!Number.isInteger(win) || win < 1) {
      return alert("Enter valid window number");
    }

    if (!windows.includes(win)) {
      return alert("Window does not exist");
    }

    socket.emit("setNumber", { number: num, window: win });

    setManualNumber("");
    setInputWindow("");
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
            className="input"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
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
            <button
              key={w}
              className="btn primary"
              onClick={() => next(w)}
            >
              Window {w}
            </button>
          ))}
        </div>

        {/* ➕ ADD / ➖ REMOVE */}
        <div className="control-row">
          <input
            type="number"
            placeholder="Window #"
            value={inputWindow}
            onChange={(e) =>
              setInputWindow(e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />

          <button className="btn primary" onClick={addWindow}>
            ➕ Add
          </button>

          <button className="btn secondary" onClick={removeWindow}>
            ➖ Remove
          </button>
        </div>

        {/* ✏️ SET NUMBER + WINDOW */}
        <div className="control-row">
          <input
            type="number"
            placeholder="Queue # (1–100)"
            value={manualNumber}
            onChange={(e) =>
              setManualNumber(e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
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