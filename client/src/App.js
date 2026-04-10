import React, { useState } from "react";
import Admin from "./Admin";
import Customer from "./Customer";
import TVDisplay from "./TVDisplay";

function App() {
  const [view, setView] = useState("customer");

  return (
    <div>
      <button onClick={() => setView("customer")}>Customer</button>
      <button onClick={() => setView("admin")}>Admin</button>
      <button onClick={() => setView("tv")}>TV</button>

      {view === "customer" && <Customer />}
      {view === "admin" && <Admin />}
      {view === "tv" && <TVDisplay />}
    </div>
  );
}

export default App;