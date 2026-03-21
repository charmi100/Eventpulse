"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

function AddEvent({ setEvents }: any) {
  useMapEvents({
    click(e) {
      const name = prompt("Enter event name:");
      if (!name) return;

      const token = localStorage.getItem('token');
      const newEvent = {
        name,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      };

      fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      })
        .then(res => res.json())
        .then(data => {
          setEvents((prev: any) => [data, ...prev]);
        });
    },
  });
  return null;
}
<MapContainer
  center={[23.0225, 72.5714]}
  zoom={12}
  style={{ height: '100%', width: '100%' }}
></MapContainer>

export default function EventMap({ events, setEvents }: any) {
  return (
    <MapContainer
  center={[23.0225, 72.5714]}
  zoom={12}
  style={{ height: "calc(100vh - 60px)", width: "100%" }}
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AddEvent setEvents={setEvents} />
      {events
        .filter((event: any) => event.lat && event.lng)
        .map((event: any) => (
          <Marker key={event._id || event.id} position={[event.lat, event.lng]}>
            <Popup>
              <strong>{event.name}</strong><br />
              {event.status || 'upcoming'}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}