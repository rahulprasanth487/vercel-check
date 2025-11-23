import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Send prompt to backend, get reply, and update chat history.
  async function handleSend() {
    if (!prompt.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setChatMessages([
      ...chatMessages,
      { role: "user", content: prompt },
      { role: "assistant", content: data.chat_history[0].response },
    ]);
    setPrompt("");
    setChatHistory(data.chat_history);
  }

  // Initially fetch full chat history.
  React.useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/chat", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "" }), // Empty prompt to get history.
      });
      const data = await res.json();
      setChatHistory(data.chat_history || []);
    }
    fetchHistory();
  }, []);

  // Keep layout inline for responsiveness but add CSS classes for visuals.
  const appStyle = { display: "flex", height: "100vh" };
  const leftPane = {
    flex: 1,
    borderRight: "1px solid #ccc",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  };
  const rightPane = { flex: 1, padding: "2rem", overflowY: "auto" };

  return (
    <div style={appStyle} className="app-container">
      {/* Left: Chat Interface */}
      <div style={leftPane} className="left-pane">
        <div className="messages" style={{ flex: 1 }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role === "user" ? "message-user" : "message-assistant"}`}>
              <b>{msg.role === "user" ? "You" : "LLM"}</b>: {msg.content}
            </div>
          ))}
        </div>
        <div className="input-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={handleSend} className="send-btn">Send</button>
        </div>
      </div>
      {/* Right: Question-Response History from MongoDB */}
      <div style={rightPane} className="right-pane">
        <h2>Chat History (MongoDB)</h2>
        <ul>
          {chatHistory.map((msg) => (
            <li key={msg._id} className="history-item">
              <div className="history-q"><strong>Q:</strong> {msg.question}</div>
              <div className="history-a"><strong>A:</strong> {msg.response}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
