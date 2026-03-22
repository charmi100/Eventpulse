"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryColors: Record<string, string> = {
  '🎵 Music':     '#e94560',
  '💻 Tech':      '#4a9eff',
  '⚽ Sports':    '#22c55e',
  '🎨 Art':       '#f0a500',
  '🍔 Food':      '#ff6b35',
  '📚 Education': '#8b5cf6',
  '🎉 Party':     '#ec4899',
  '🏃 Fitness':   '#14b8a6',
  'default':      '#e94560',
};

function createPin(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"><div style="width:10px;height:10px;background:white;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
}

function AddEvent({ setEvents, token }: any) {
  useMapEvents({
    click(e) {
      const name = prompt("Enter event name:");
      if (!name) return;
      fetch("https://eventpulse-backend-b9ld.onrender.com/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          startTime: new Date().toISOString(),
        }),
      })
        .then(res => res.json())
        .then(data => setEvents((prev: any) => [data, ...prev]));
    },
  });
  return null;
}

export default function EventMap({ events, setEvents, token }: any) {
  return (
    <MapContainer
      center={[23.0225, 72.5714]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <AddEvent setEvents={setEvents} token={token} />
      {events
        .filter((e: any) => e.lat && e.lng)
        .map((event: any) => {
          const color = categoryColors[event.category] || categoryColors['default'];
          return (
            <Marker
              key={event._id || event.id}
              position={[event.lat, event.lng]}
              icon={createPin(color)}
            >
              <Popup>
                <div style={{ fontFamily: 'Segoe UI, sans-serif', minWidth: '180px', padding: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ fontSize: '11px', color: color, fontWeight: 600, textTransform: 'uppercase' }}>
                      {event.category || 'Event'}
                    </span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px', color: '#111' }}>
                    {event.name}
                  </p>
                  {event.startTime && (
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 8px' }}>
                      {new Date(event.startTime).toLocaleDateString()}
                    </p>
                  )}
                  {event.reviews?.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#f0a500', margin: '0 0 8px' }}>
                      {(event.reviews.reduce((s: number, r: any) => s + r.rating, 0) / event.reviews.length).toFixed(1)} stars
                    </p>
                  )}
                  
                    href={`/events/${event._id}`}
                    <a
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: color,
                      color: '#fff',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                    >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}