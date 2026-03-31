import express from 'express';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // ✅ important

const router = express.Router();


// ✅ GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ CREATE EVENT (WITH IMAGE UPLOAD)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const event = await Event.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      startTime: req.body.startTime,
      lat: req.body.lat,
      lng: req.body.lng,
      image: req.file ? req.file.path : "", // ✅ Cloudinary URL
      createdBy: req.user.id,
    });

    // 🔴 Emit real-time event
    const io = req.app.get('io');
    if (io) io.emit('eventCreated', event);

    res.status(201).json(event);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE EVENT STATUS
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


// ✅ DELETE EVENT
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) io.emit('eventDeleted', { id: req.params.id });

    res.json({ message: 'Event deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET SINGLE EVENT
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ ADD REVIEW
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.reviews.push({
      user: req.user.id,
      name: req.body.name || 'Anonymous',
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


// ✅ DELETE REVIEW
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


// ✅ RSVP TO EVENT
router.post('/:id/rsvp', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user.id;
    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      event.attendees = event.attendees.filter(
        id => id.toString() !== userId
      );
    } else {
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