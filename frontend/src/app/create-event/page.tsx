'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="ce-map-loader">🗺️ Loading map...</div>,
});

export default function CreateEventPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '🎵 Music',
    date: '',
    time: '',
    lat: null as number | null,
    lng: null as number | null,
  });

  const categories = ['🎵 Music', '💻 Tech', '⚽ Sports', '🎨 Art', '🍔 Food', '📚 Education', '🎉 Party', '🏃 Fitness'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lat || !form.lng) { setError('Please pick a location on the map!'); return; }
    setLoading(true);
    setError('');
    try {
      const startTime = new Date(`${form.date}T${form.time}`).toISOString();
      const res = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          startTime,
          lat: form.lat,
          lng: form.lng,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      router.push('/');
    } catch {
      setError('Cannot connect to server.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a14; }
        .ce-page { min-height: 100vh; background: #0a0a14; font-family: 'DM Sans', sans-serif; color: #fff; display: flex; flex-direction: column; }
        .ce-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 32px; height: 60px; background: linear-gradient(135deg, #12122a, #1a1a35); border-bottom: 1px solid #1e1e35; position: sticky; top: 0; z-index: 1000; }
        .ce-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #fff; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; }
        .ce-nav-logo em { color: #e94560; font-style: normal; }
        .ce-back { background: transparent; border: 1px solid #2a2a45; color: #aaa; padding: 7px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .ce-body { display: flex; flex: 1; height: calc(100vh - 60px); }
        .ce-form-side { width: 420px; min-width: 420px; padding: 28px 24px; overflow-y: auto; border-right: 1px solid #1e1e35; background: #0d0d1f; display: flex; flex-direction: column; gap: 16px; }
        .ce-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 1px; color: #fff; }
        .ce-sub { font-size: 13px; color: rgba(255,255,255,0.35); }
        .ce-error { background: rgba(233,69,96,0.1); border: 1px solid rgba(233,69,96,0.25); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #ff6b6b; }
        .ce-group { display: flex; flex-direction: column; gap: 6px; }
        .ce-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .ce-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; width: 100%; }
        .ce-input::placeholder { color: rgba(255,255,255,0.18); }
        .ce-input:focus { border-color: rgba(233,69,96,0.5); background: rgba(233,69,96,0.04); }
        .ce-textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; width: 100%; resize: vertical; min-height: 80px; }
        .ce-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .ce-textarea:focus { border-color: rgba(233,69,96,0.5); background: rgba(233,69,96,0.04); }
        .ce-row { display: flex; gap: 12px; }
        .ce-row .ce-group { flex: 1; }
        .ce-categories { display: flex; flex-wrap: wrap; gap: 8px; }
        .ce-cat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 100px; padding: 7px 14px; font-size: 12px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .ce-cat.active { background: rgba(233,69,96,0.15); border-color: rgba(233,69,96,0.4); color: #e94560; }
        .ce-location-hint { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.35); display: flex; align-items: center; gap: 8px; }
        .ce-location-hint.selected { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #22c55e; }
        .ce-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e94560, #c0203d); color: #fff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 20px rgba(233,69,96,0.3); margin-top: 8px; }
        .ce-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(233,69,96,0.45); }
        .ce-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .ce-map-side { flex: 1; position: relative; }
        .ce-map-overlay { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); background: rgba(10,10,20,0.85); backdrop-filter: blur(8px); color: #aaa; font-size: 12px; padding: 8px 16px; border-radius: 20px; border: 1px solid #2a2a45; white-space: nowrap; z-index: 500; font-family: 'DM Sans', sans-serif; }
        .ce-map-loader { height: 100%; display: flex; align-items: center; justify-content: center; background: #12122a; color: #555; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="ce-page">
        <nav className="ce-nav">
          <button className="ce-back" onClick={() => router.push('/')}>← Back to Map</button>
          <div className="ce-nav-logo">⚡ Event<em>Pulse</em></div>
          <div style={{ width: 120 }} />
        </nav>

        <div className="ce-body">
          {/* Form */}
          <div className="ce-form-side">
            <div className="ce-title">Create Event</div>
            <p className="ce-sub">Fill details and pick location on the map</p>

            {error && <div className="ce-error">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="ce-group">
                <label className="ce-label">Event Name</label>
                <input className="ce-input" placeholder="e.g. Ahmedabad Music Fest" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="ce-group">
                <label className="ce-label">Description</label>
                <textarea className="ce-textarea" placeholder="Tell people what this event is about..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="ce-row">
                <div className="ce-group">
                  <label className="ce-label">Date</label>
                  <input className="ce-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ colorScheme: 'dark' }} />
                </div>
                <div className="ce-group">
                  <label className="ce-label">Time</label>
                  <input className="ce-input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required style={{ colorScheme: 'dark' }} />
                </div>
              </div>

              <div className="ce-group">
                <label className="ce-label">Category</label>
                <div className="ce-categories">
                  {categories.map(cat => (
                    <button key={cat} type="button" className={`ce-cat${form.category === cat ? ' active' : ''}`} onClick={() => setForm({ ...form, category: cat })}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ce-group">
                <label className="ce-label">Location</label>
                <div className={`ce-location-hint${form.lat ? ' selected' : ''}`}>
                  {form.lat ? `✅ ${form.lat.toFixed(4)}, ${form.lng?.toFixed(4)}` : '📍 Click on the map to pick location'}
                </div>
              </div>

              <button type="submit" className="ce-btn" disabled={loading}>
                {loading ? 'Creating Event...' : 'Create Event →'}
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="ce-map-side">
            <div className="ce-map-overlay">📍 Click anywhere to set event location</div>
            <LocationPicker
              onLocationSelect={(lat, lng) => setForm(f => ({ ...f, lat, lng }))}
              selectedLat={form.lat}
              selectedLng={form.lng}
            />
          </div>
        </div>
      </div>
    </>
  );
}