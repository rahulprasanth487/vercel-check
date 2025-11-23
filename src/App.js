import React, { useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [todos, setTodos] = useState([]);

  async function checkHealth() {
    const res = await fetch("/api/health");
    const data = await res.json();
    setStatus(data.status || "no response");
    setTodos(data.todos || []);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FastAPI Health Demo</h1>
      <button onClick={checkHealth}>Check Health</button>
      <p>Status: {status}</p>
      <h2>Todos from MongoDB</h2>
      <table border="1" cellPadding="8" style={{ minWidth: "300px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td>{todo.title}</td>
              <td>{todo.done ? "Done" : "Not done"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
