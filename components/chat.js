import { useEffect, useRef, useState } from "react";

function Chat() {
  const socketRef = useRef(null);

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://echo.websocket.events");

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        {
          user: "Echo",
          text: event.data,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    };

    return () => socketRef.current.close();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      user: username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msgData]);
    socketRef.current.send(message);
    setMessage("");
  };

  if (!joined) {
    return (
      <div className="card p-4 shadow-lg join-box">
        <h4 className="text-center mb-3">Join Chat</h4>
        <input
          className="form-control mb-3"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="btn btn-primary w-100"
          onClick={() => username && setJoined(true)}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="chat-box card shadow-lg">
      <div className="card-header bg-primary text-white text-center">
        Real-Time Chat
      </div>

      <div className="card-body chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.user === username ? "text-end" : "text-start"
            }`}
          >
            <div className="small text-muted">
              {msg.user} • {msg.time}
            </div>
            <div className="p-2 rounded bg-light d-inline-block">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer d-flex">
        <input
          className="form-control me-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-success" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
