const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/eventpulse")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 🔥 EVENT SCHEMA
const Event = mongoose.model("Event", {
  title: String,
  lat: Number,
  lng: Number,
});

// 🔥 GET EVENTS
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// 🔥 ADD EVENT
app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

// 🔥 START SERVER
app.listen(5001, () => {
  console.log("Server running on port 5001");
});