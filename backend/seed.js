const mongoose = require('mongoose');

// Define the model directly in this file
const Booking = mongoose.model('Booking', new mongoose.Schema({
  service: String, 
  urgency: String, 
  tech: String, 
  techPrice: String, 
  name: String, 
  address: String, 
  phone: String, 
  status: { type: String, default: 'Pending' }, 
  createdAt: { type: Date, default: Date.now }
}));

const seedData = [
  { service: 'Electrician', name: 'Rahul', address: 'Indira Nagar', phone: '9876543210' },
  { service: 'Plumber', name: 'Amit', address: 'Aliganj', phone: '9876543211' },
  { service: 'Car Mechanic', name: 'Priya', address: 'Gomti Nagar', phone: '9876543212' }
];

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/instantfix');
  await Booking.deleteMany({}); // Optional: Clears old data first
  await Booking.insertMany(seedData);
  console.log("✅ Database seeded with 3 bookings!");
  process.exit();
}
seed();