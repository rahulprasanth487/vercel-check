import React, { useState } from "react";

function App() {
  const [status, setStatus] = useState("");

  async function checkHealth() {
    const res = await fetch("http://127.0.0.1:5001/api/health");
    const data = await res.json();
    setStatus(data.status || "no response");
  }

  return (
    <div>
      <h1>FastAPI Health Demo</h1>
      <button onClick={checkHealth}>Check Health</button>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
