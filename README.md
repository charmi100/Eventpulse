# ⚡ EventPulse

> Discover, create and track events happening around you — all on one interactive map in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://eventpulse-qh1kp0c2h-pcharmipatel002-3831s-projects.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge&logo=render)](https://eventpulse-backend-b9ld.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-green?style=for-the-badge&logo=github)](https://github.com/charmi100/Eventpulse)

---

## 🌟 Features

- 🗺️ Interactive Map — Browse events on a live Leaflet map with colored category pins
- ➕ Create Events — Add events with name, description, date, category and location picker
- 🔍 Search and Filter — Search by name, filter by category (Music, Tech, Sports, etc.)
- ⭐ Reviews and Ratings — Leave star ratings and comments on events
- 🔴 Live Status — Mark events as Upcoming, Starting Soon, Happening Now, or Finished
- 🎟️ RSVP — Click I'm Going to RSVP and see attendee count
- 🌙 Nightlife Mode — Toggle dark map and filter nightlife events after 6pm
- 🔔 Smart Notifications — Browser push notifications for new events
- 🗑️ Delete Events — Remove events you created
- 🔐 Authentication — Secure login/register with JWT

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 — React framework with App Router
- TypeScript — Type-safe code
- Leaflet / React-Leaflet — Interactive maps

### Backend
- Node.js + Express — REST API
- MongoDB + Mongoose — Database
- JWT — Authentication
- bcryptjs — Password hashing

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting
- MongoDB Atlas — Cloud database

---

## 🚀 Getting Started

### Clone the repo
```
git clone https://github.com/charmi100/Eventpulse.git
cd Eventpulse
```

### Backend Setup
```
cd backend
npm install
```

Create .env file:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

Start backend:
```
npm start
```

### Frontend Setup
```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## 📱 Pages

| Page | Description |
|------|-------------|
| /login | Premium login page with concert background |
| /register | Sign up page |
| / | Home page with interactive map and events sidebar |
| /create-event | Create event form with map location picker |
| /events/[id] | Event details with reviews and RSVP |

---

## 🗂️ Project Structure
```
Eventpulse/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── context/
        └── utils/
```

---

## 👩‍💻 Author

Made with love by Charmi Patel

---

## �� License

MIT License
