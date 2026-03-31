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
  const [image, setImage] = useState<File | null>(null); // ✅ ADDED

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

    if (!form.lat || !form.lng) {
      setError('Please pick a location on the map!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const startTime = new Date(`${form.date}T${form.time}`).toISOString();

      // ✅ FORMDATA (IMPORTANT)
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("startTime", startTime);
      formData.append("lat", String(form.lat));
      formData.append("lng", String(form.lng));

      if (image) {
        formData.append("image", image); // ✅ IMAGE
      }

      const res = await fetch('http://localhost:8080/api/events', { // ✅ LOCAL BACKEND
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // ❗ NO Content-Type
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/');
    } catch (err) {
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
        .ce-back { background: transparent; border: 1px solid #2a2a45; color: #aaa; padding: 7px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; }
        .ce-body { display: flex; flex: 1; height: calc(100vh - 60px); }
        .ce-form-side { width: 420px; min-width: 420px; padding: 28px 24px; overflow-y: auto; border-right: 1px solid #1e1e35; background: #0d0d1f; display: flex; flex-direction: column; gap: 16px; }
        .ce-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 1px; color: #fff; }
        .ce-sub { font-size: 13px; color: rgba(255,255,255,0.35); }
        .ce-error { background: rgba(233,69,96,0.1); border: 1px solid rgba(233,69,96,0.25); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #ff6b6b; }
        .ce-group { display: flex; flex-direction: column; gap: 6px; }
        .ce-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .ce-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; outline: none; width: 100%; }
        .ce-textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; width: 100%; min-height: 80px; }
        .ce-row { display: flex; gap: 12px; }
        .ce-categories { display: flex; flex-wrap: wrap; gap: 8px; }
        .ce-cat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 100px; padding: 7px 14px; font-size: 12px; color: rgba(255,255,255,0.5); cursor: pointer; }
        .ce-cat.active { background: rgba(233,69,96,0.15); border-color: rgba(233,69,96,0.4); color: #e94560; }
        .ce-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e94560, #c0203d); color: #fff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; margin-top: 8px; }
      `}</style>

      <div className="ce-page">
        <nav className="ce-nav">
          <button className="ce-back" onClick={() => router.push('/')}>← Back</button>
          <div className="ce-nav-logo">⚡ Event<em>Pulse</em></div>
          <div style={{ width: 120 }} />
        </nav>

        <div className="ce-body">
          <div className="ce-form-side">
            <div className="ce-title">Create Event</div>

            {error && <div className="ce-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input className="ce-input" placeholder="Event Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

              <textarea className="ce-textarea" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

              <input type="date" className="ce-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />

              <input type="time" className="ce-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />

              {/* ✅ IMAGE INPUT */}
              <input type="file" className="ce-input" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

              <button type="submit" className="ce-btn">
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>

          <div className="ce-map-side">
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