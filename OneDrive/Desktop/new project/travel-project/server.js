require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // ✅ only once

const app = express();
const PORT = process.env.PORT || 5000;

const uri = "mongodb+srv://akash:Akash%402345@cluster0.lm6c7cw.mongodb.net/bookingDB";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "av786906@gmail.com",
        pass: "ewkfxkwqyhcyowlf" 
    }
});
// Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  destination: String,
  date: String,
  travelers: Number,
  requirements: String,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// POST Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Send email
    await transporter.sendMail({
  from: 'av786906@gmail.com',
  to: req.body.email, // 👈 user email from form
  subject: "New Booking !",
  text: `Hello ${req.body.name}, your booking is confirmed!`
});

    res.json({ success: true, message: "Booking saved" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET Bookings
app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

app.get('/', (req, res) => {
  res.send("🚀 Server is running successfully!");
});

require('dotenv').config();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: "https://roject.netlify.app",
  methods: ["GET", "POST"],
  credentials: true
}));