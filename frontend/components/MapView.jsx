"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView() {
  return (
    <MapContainer
      center={[23.02, 72.57]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={[23.02, 72.57]}>
        <Popup>Event happening here 🎉</Popup>
      </Marker>
    </MapContainer>
  );
}