import React, { useState } from "react";
import Admin from "./Admin";
import Customer from "./Customer";

function App() {
  const [view, setView] = useState("customer");

  return (
    <div>
      <div style={{ textAlign: "center", margin: 10 }}>
        <button onClick={() => setView("customer")}>Customer View</button>
        <button onClick={() => setView("admin")}>Admin View</button>
      </div>

      {view === "admin" ? <Admin /> : <Customer />}
    </div>
  );
}

export default App;