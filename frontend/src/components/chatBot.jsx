import { useState } from 'react'

const ChatBot = ({ showPage }) => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! 👋 I'm FixBot, your AI assistant. How can I help you today?" },
    { role: 'bot', text: "I can help you book a service, track your technician, or answer any questions!" },
  ])
  const [input, setInput] = useState('')

  const quickReplies = [
    { label: '📋 Book a service', msg: 'Book a service' },
    { label: '📍 Track booking', msg: 'Track my booking' },
    { label: '🔧 Services', msg: 'What services do you offer?' },
    { label: '💰 Pricing', msg: 'What are your prices?' },
  ]

  const getBotReply = (msg) => {
    const lower = msg.toLowerCase()
    if (lower.includes('book') || lower.includes('service')) {
      setTimeout(() => showPage('booking'), 1000)
      return 'Sure! Let me take you to the booking page. 🚀'
    }
    if (lower.includes('track') || lower.includes('location')) {
      setTimeout(() => showPage('tracking'), 1000)
      return 'Taking you to live tracking! 📍'
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee'))
      return 'Our prices are transparent! Electrician from ₹199, Plumber from ₹149, Car Mechanic from ₹299. Platform fee is just ₹49. 💰'
    if (lower.includes('emergency') || lower.includes('urgent'))
      return "Yes! We provide 24/7 emergency services. Select 'Emergency' while booking and we'll dispatch immediately! 🚨"
    if (lower.includes('offer') || lower.includes('services'))
      return 'We offer: ⚡ Electrician, 🔧 Plumber, 🚗 Car Mechanic, 🚽 Toilet Cleaning, 📺 Appliance Repair, 🏠 House Cleaning. All with 24/7 support!'
    return 'Great question! I can help you book a service, track your technician, or tell you about pricing. 😊'
  }

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getBotReply(msg) }])
    }, 600)
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} title="AI Assistant">🤖</button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-hname">FixBot AI</div>
              <div className="chat-hsub">● Online · Instant Fix Assistant</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
          </div>

          <div className="chat-chips">
            {quickReplies.map((q) => (
              <button key={q.label} className="chat-chip" onClick={() => sendMessage(q.msg)}>{q.label}</button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="chat-send" onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot