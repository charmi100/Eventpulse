import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:    { type: String },
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  lat:         { type: Number, required: true },
  lng:         { type: Number, required: true },
  status:      {
    type: String,
    enum: ['upcoming', 'starting-soon', 'happening-now', 'finished'],
    default: 'upcoming'
  },
  startTime:   { type: Date },
  endTime:     { type: Date },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reviews:     [reviewSchema],
  description: { type: String },
category:    { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);