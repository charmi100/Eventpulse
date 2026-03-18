import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Events (in-memory for now)
let events = [
  { id: 1, name: "Music Fest", lat: 23.0225, lng: 72.5714 }
];

// GET events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// POST event (protected)
app.post('/api/events', authMiddleware, (req, res) => {
  const { name, lat, lng } = req.body;
  const newEvent = {
    id: events.length + 1,
    name,
    lat,
    lng,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});