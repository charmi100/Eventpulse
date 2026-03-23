import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: false,
}));

// Keep alive ping
setInterval(() => {
  fetch('https://eventpulse-backend-b9ld.onrender.com/api/events')
    .then(() => console.log('Keep alive ping ✅'))
    .catch(() => console.log('Ping failed'));
}, 14 * 60 * 1000); // every 14 minutes

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});