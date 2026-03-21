'use client';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  onLocationSelect,
  selectedLat,
  selectedLng,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLat: number | null;
  selectedLng: number | null;
}) {
  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onLocationSelect={onLocationSelect} />
      {selectedLat && selectedLng && (
        <Marker position={[selectedLat, selectedLng]} icon={icon} />
      )}
    </MapContainer>
  );
}