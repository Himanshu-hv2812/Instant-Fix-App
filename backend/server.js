const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://instant-fix-app.onrender.com' // YOUR ACTUAL LIVE FRONTEND URL
  ],
  credentials: true
}));
app.use(express.json());

// 1. Connect to Local MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to Local MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const Booking = mongoose.model('Booking', new mongoose.Schema({
  service: String, urgency: String, tech: String, techPrice: String, name: String, address: String, phone: String, status: { type: String, default: 'Pending' }, createdAt: { type: Date, default: Date.now }
}));

// 2. Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- ROUTES ---

// Booking Route
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// NEW: Chatbot Route
// NEW: Chatbot Route with Memory
app.post('/api/chat', async (req, res) => {
  try {
    const chatHistory = req.body.history;

    // Convert the frontend array into a text transcript for Gemini
    const transcript = chatHistory.map(m => `${m.role === 'bot' ? 'FixBot' : 'User'}: ${m.text}`).join('\n');
    
    // The "System Instructions" + The Transcript
    const prompt = `You are FixBot, an AI assistant for a home services app called "Instant Fix" in Lucknow, India. 
    You help users book electricians, plumbers, car mechanics, and cleaners. 
    Keep your answers very short, polite, and helpful (1-2 sentences max). 
    Do not use markdown like asterisks or bold text. 
    IMPORTANT STRICT RULE: If the user asks to track their booking, track their order, or find their technician, YOU MUST reply exactly with: "I am opening your Live Tracking Map right now! 📍" Do not tell them to call a support number.

    Here is the conversation transcript so far:
    ${transcript}

    Write FixBot's next reply based on the transcript above:`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ reply: "Oops! My AI brain is taking a break. Please call 1800-FIX-NOW for immediate help." });
  }
});

const PORT = process.env.PORT || 5000;

// Verification Route
app.get('/api/verify-order/:id', async (req, res) => {
  try {
    // MongoDB uses _id. For simplicity in demo, we'll search by Name or just confirm it exists
    // Let's assume you'll use the MongoDB generated ID.
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Order not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
