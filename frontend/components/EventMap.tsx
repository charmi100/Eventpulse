"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type EventType = {
  id: number;
  title: string;
  lat: number;
  lng: number;
};

export default function EventMap() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const events: EventType[] = [
    { id: 1, title: "Music Fest", lat: 21.5222, lng: 70.4579 },
  ];

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <MapContainer
        center={[21.5222, 70.4579]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng] as [number, number]}
            eventHandlers={{
              click: () => setSelectedEvent(event),
            }}
          >
            <Popup>{event.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedEvent && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          {selectedEvent.title}
        </div>
      )}
    </div>
  );
}