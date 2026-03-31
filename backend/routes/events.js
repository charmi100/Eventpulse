import express from 'express';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, lat, lng, startTime, endTime } = req.body;
    const event = await Event.create({
      name, lat, lng, startTime, endTime,
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, lat, lng, startTime, endTime, description, category } = req.body;
    const event = await Event.create({
      name, lat, lng, startTime, endTime, description, category,
      createdBy: req.user.id,
    });

    // 👇 Emit to all connected users
    const io = req.app.get('io');
    io.emit('eventCreated', event);

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update event status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    // 👇 Emit to all connected users
    const io = req.app.get('io');
    io.emit('eventDeleted', { id: req.params.id });

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  // GET single event by ID
router.get('/:id', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  // POST add review
router.post('/:id/reviews', authMiddleware, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      event.reviews.push({
        user:    req.user.id,
        name:    req.body.name || 'Anonymous',
        rating,
        comment,
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // DELETE review
  router.delete('/:id/reviews/:reviewId', authMiddleware, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      event.reviews = event.reviews.filter(
        r => r._id.toString() !== req.params.reviewId
      );
      await event.save();
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  // POST RSVP to event
router.post('/:id/rsvp', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.id;
    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      // Cancel RSVP
      event.attendees = event.attendees.filter(id => id.toString() !== userId);
    } else {
      // Add RSVP
      event.attendees.push(userId);
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;