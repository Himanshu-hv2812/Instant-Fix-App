import { useState, useRef, useEffect } from "react";

const ChatBot = ({ showPage }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello there! 👋 I'm FixBot. Are you looking to book a service, track an order, or check our prices today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const msgsEndRef = useRef(null);

  const quickReplies = [
    { label: "📋 Book a service", msg: "Book a service" },
    { label: "📍 Track booking", msg: "Track my booking" },
    { label: "🔧 Services", msg: "What services do you offer?" },
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (textToUse) => {
    const msg = textToUse || input.trim();
    if (!msg) return;

    setInput("");
    
    // 1. Create the new history array
    const updatedMessages = [...messages, { role: "user", text: msg }];
    setMessages(updatedMessages);
    setIsTyping(true);

    // 2. Navigation Triggers (Keep your existing logic)
    const lower = msg.toLowerCase();
    if (lower.includes("book") || lower.includes("service")) {
      setTimeout(() => showPage("booking"), 1000);
    } else if (lower.includes("track") || lower.includes("location")) {
      setTimeout(() => showPage("tracking"), 1000);
    }

    try {
      // 3. Send the full history, not just the current message
     const API_URL = import.meta.env.VITE_API_URL || "https://instant-fix-app.onrender.com";
const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedMessages }), 
      });

      const data = await response.json();

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I'm having trouble connecting. Please check your backend server." },
      ]);
    }
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        title="AI Assistant"
      >
        🤖
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-hname">FixBot AI</div>
              <div className="chat-hsub">● Live Generative AI</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-msgs" style={{ paddingBottom: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div
                className="msg bot"
                style={{ fontStyle: "italic", color: "var(--muted)" }}
              >
                FixBot is typing...
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>

          <div className="chat-chips">
            {quickReplies.map((q) => (
              <button
                key={q.label}
                className="chat-chip"
                onClick={() => sendMessage(q.msg)}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask the AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isTyping}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
