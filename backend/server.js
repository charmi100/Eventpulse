import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://eventpulse-qh1kp0c2h-pcharmipatel002-3831s-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});