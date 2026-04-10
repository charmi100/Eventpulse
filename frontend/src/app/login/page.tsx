'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      login(data.token, data.user);
      window.location.href = '/';
    } catch {
      setError('Cannot connect to server.');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .lp-root { min-height: 100vh; width: 100%; display: flex; font-family: 'Outfit', sans-serif; background: #050510; overflow: hidden; position: relative; }
        .lp-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); animation: blobFloat linear infinite; opacity: 0.5; }
        .blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, #ff006644, #ff006600); top: -200px; left: -100px; animation-duration: 20s; }
        .blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, #7c3aed44, #7c3aed00); top: 30%; right: -150px; animation-duration: 25s; animation-delay: -8s; }
        .blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, #0ea5e944, #0ea5e900); bottom: -100px; left: 30%; animation-duration: 18s; animation-delay: -4s; }
        .blob-4 { width: 300px; height: 300px; background: radial-gradient(circle, #f59e0b33, #f59e0b00); top: 60%; left: 10%; animation-duration: 22s; animation-delay: -12s; }
        @keyframes blobFloat { 0% { transform: translate(0,0) scale(1); } 25% { transform: translate(30px,-50px) scale(1.05); } 50% { transform: translate(-20px,30px) scale(0.95); } 75% { transform: translate(50px,20px) scale(1.02); } 100% { transform: translate(0,0) scale(1); } }
        .lp-noise { position: fixed; inset: 0; z-index: 1; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events: none; }
        .lp-grid { position: fixed; inset: 0; z-index: 1; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }
        .lp-left { flex: 1.4; display: flex; flex-direction: column; justify-content: center; padding: 80px; position: relative; z-index: 2; }
        .lp-logo { display: flex; align-items: center; gap: 12px; position: absolute; top: 48px; left: 80px; animation: fadeUp 0.6s ease both; }
        .lp-logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #ff0066, #7c3aed); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 20px rgba(255,0,102,0.4); }
        .lp-logo-text { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 1px; }
        .lp-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,0,102,0.1); border: 1px solid rgba(255,0,102,0.2); border-radius: 100px; padding: 6px 16px; font-size: 11px; font-weight: 600; color: #ff6699; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; animation: fadeUp 0.6s ease 0.1s both; }
        .lp-tag::before { content: ''; width: 6px; height: 6px; background: #ff0066; border-radius: 50%; box-shadow: 0 0 8px #ff0066; animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
        .lp-headline { font-family: 'Syne', sans-serif; font-size: clamp(52px, 6vw, 88px); font-weight: 800; line-height: 0.95; color: #fff; margin-bottom: 24px; animation: fadeUp 0.6s ease 0.2s both; }
        .lp-headline .accent { background: linear-gradient(135deg, #ff0066, #7c3aed, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lp-desc { font-size: 16px; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 400px; margin-bottom: 48px; font-weight: 300; animation: fadeUp 0.6s ease 0.3s both; }
        .lp-features { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.6s ease 0.4s both; }
        .lp-feature { display: flex; align-items: center; gap: 14px; }
        .lp-feature-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .lp-feature-text { font-size: 14px; color: rgba(255,255,255,0.5); font-weight: 400; }
        .lp-feature-text strong { color: rgba(255,255,255,0.8); font-weight: 600; }
        .lp-divider { width: 1px; background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%); position: relative; z-index: 2; flex-shrink: 0; }
        .lp-right { flex: 0.9; display: flex; align-items: center; justify-content: center; padding: 60px 48px; position: relative; z-index: 2; }
        .lp-glass { width: 100%; max-width: 400px; background: rgba(255,255,255,0.03); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 48px 40px; box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); animation: fadeUp 0.6s ease 0.2s both; position: relative; overflow: hidden; }
        .lp-glass::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }
        .lp-glass-glow { position: absolute; top: -100px; right: -100px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(255,0,102,0.08) 0%, transparent 70%); pointer-events: none; }
        .lp-form-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #ff6699; margin-bottom: 10px; }
        .lp-form-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 6px; line-height: 1.1; }
        .lp-form-sub { font-size: 13px; color: rgba(255,255,255,0.25); margin-bottom: 36px; font-weight: 300; }
        .lp-error { background: rgba(255,0,102,0.08); border: 1px solid rgba(255,0,102,0.2); border-radius: 12px; padding: 12px 16px; font-size: 13px; color: #ff6699; margin-bottom: 20px; }
        .lp-field { margin-bottom: 20px; position: relative; }
        .lp-field-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 8px; display: block; transition: color 0.2s; }
        .lp-field.focused .lp-field-label { color: #ff6699; }
        .lp-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 18px; color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; transition: all 0.3s; }
        .lp-input::placeholder { color: rgba(255,255,255,0.15); }
        .lp-input:focus { border-color: rgba(255,0,102,0.4); background: rgba(255,0,102,0.04); box-shadow: 0 0 0 4px rgba(255,0,102,0.06); }
        .lp-submit { width: 100%; padding: 15px; background: linear-gradient(135deg, #ff0066 0%, #7c3aed 100%); color: #fff; border: none; border-radius: 12px; font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; margin-top: 8px; position: relative; overflow: hidden; transition: all 0.3s; box-shadow: 0 8px 24px rgba(255,0,102,0.25); }
        .lp-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,0,102,0.4); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .lp-footer { text-align: center; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.2); }
        .lp-footer a { color: #ff6699; text-decoration: none; font-weight: 600; }
        .lp-stats { display: flex; gap: 0; margin-top: 56px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); animation: fadeUp 0.6s ease 0.5s both; }
        .lp-stat { flex: 1; padding-right: 24px; border-right: 1px solid rgba(255,255,255,0.05); margin-right: 24px; }
        .lp-stat:last-child { border-right: none; margin-right: 0; padding-right: 0; }
        .lp-stat-num { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 4px; }
        .lp-stat-label { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="lp-root">
        <div className="lp-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
        </div>
        <div className="lp-noise" />
        <div className="lp-grid" />

        <div className="lp-left">
          <div className="lp-logo">
            <div className="lp-logo-icon">⚡</div>
            <span className="lp-logo-text">EventPulse</span>
          </div>
          <div className="lp-tag">Live Events Platform</div>
          <h1 className="lp-headline">
            Feel The<br />
            <span className="accent">Pulse</span><br />
            Of The City
          </h1>
          <p className="lp-desc">
            Discover events happening around you on a live interactive map. Create, explore, review and attend — all in one place.
          </p>
          <div className="lp-features">
            {[
              { icon: '🗺️', bg: 'rgba(14,165,233,0.15)', label: 'Interactive Map', desc: 'Live event pins with categories' },
              { icon: '⭐', bg: 'rgba(245,158,11,0.15)', label: 'Reviews & Ratings', desc: 'Rate and review events' },
              { icon: '🎟️', bg: 'rgba(124,58,237,0.15)', label: 'RSVP System', desc: "See who's attending events" },
              { icon: '🌙', bg: 'rgba(255,0,102,0.15)', label: 'Nightlife Mode', desc: 'Dark map for night events' },
            ].map((f, i) => (
              <div className="lp-feature" key={i}>
                <div className="lp-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                <div className="lp-feature-text"><strong>{f.label}</strong> — {f.desc}</div>
              </div>
            ))}
          </div>
          <div className="lp-stats">
            {[
              { num: '2.4K+', label: 'Events' },
              { num: '18K+', label: 'Users' },
              { num: '94%', label: 'Satisfaction' },
            ].map((s, i) => (
              <div className="lp-stat" key={i}>
                <div className="lp-stat-num">{s.num}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-divider" />

        <div className="lp-right">
          <div className="lp-glass">
            <div className="lp-glass-glow" />
            <p className="lp-form-eyebrow">Welcome Back</p>
            <h2 className="lp-form-title">Sign In</h2>
            <p className="lp-form-sub">Enter your credentials to continue exploring</p>
            {error && <div className="lp-error">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className={`lp-field ${focused === 'email' ? 'focused' : ''}`}>
                <label className="lp-field-label">Email Address</label>
                <input
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>
              <div className={`lp-field ${focused === 'password' ? 'focused' : ''}`}>
                <label className="lp-field-label">Password</label>
                <input
                  className="lp-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>
              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>
            <p className="lp-footer">
              No account yet? <a href="/register">Join EventPulse</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}