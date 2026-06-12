const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows the React frontend to talk to this server
app.use(express.json()); // Parses incoming JSON requests

// Connect to Local MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to Local MongoDB (Offline Mode Ready!)'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define the Booking Schema
const bookingSchema = new mongoose.Schema({
  service: String,
  urgency: String,
  tech: String,
  techPrice: String,
  name: String,
  address: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- ROUTES ---

// 1. Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// 2. Fetch all bookings (for tracking or an admin panel later)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Local Server running on port ${PORT}`);
});