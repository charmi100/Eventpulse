"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function EventMap({ events }: { events: any[] }) {
  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Popup>{event.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}