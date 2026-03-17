import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/events", (req, res) => {
  res.json([
    { id: 1, name: "Music Fest", lat: 23.0225, lng: 72.5714 },
    { id: 2, name: "Startup Meetup", lat: 23.03, lng: 72.58 }
  ]);
});

const PORT = 5001; // 🔥 change port (5000 causing issue)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});