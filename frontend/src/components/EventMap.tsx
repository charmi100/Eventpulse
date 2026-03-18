"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

function AddEvent({ setEvents }: any) {
  useMapEvents({
    click(e) {
      const name = prompt("Enter event name:");
      if (!name) return;

      const newEvent = {
        name,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })
        .then((res) => res.json())
        .then((data) => {
          setEvents((prev: any) => [...prev, data]);
        });
    },
  });

  return null;
}

export default function EventMap({ events, setEvents }: any) {
  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <AddEvent setEvents={setEvents} />

      {events
  .filter((event: any) => event.lat && event.lng)  // 👈 skip invalid events
  .map((event: any) => (
    <Marker key={event.id} position={[event.lat, event.lng]}>
      <Popup>{event.name}</Popup>
    </Marker>
  ))
}
      ))
    </MapContainer>
  );
}