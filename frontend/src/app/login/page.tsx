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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060608; }
        .lp { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #060608; overflow: hidden; position: relative; }
        .lp-bg { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1540039155733-5bb30b4db9a2?w=1920&q=80'); background-size: cover; background-position: center; opacity: 0.2; z-index: 0; }
        .lp-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(6,6,8,0.95) 40%, rgba(6,6,8,0.7) 100%); z-index: 1; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); z-index: 1; pointer-events: none; }
        .orb1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%); top: -150px; left: -100px; }
        .orb2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(80,40,180,0.2) 0%, transparent 70%); bottom: -100px; right: 300px; }
        .lp-left { flex: 1.3; display: flex; flex-direction: column; justify-content: flex-end; padding: 60px; position: relative; z-index: 2; }
        .lp-logo { position: absolute; top: 48px; left: 60px; display: flex; align-items: center; gap: 10px; }
        .lp-logo-icon { font-size: 26px; }
        .lp-logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #fff; letter-spacing: 3px; }
        .lp-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #e94560; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .lp-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: #e94560; }
        .lp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 7vw, 96px); line-height: 0.92; color: #fff; letter-spacing: 2px; margin-bottom: 20px; }
        .lp-title em { color: #e94560; font-style: normal; }
        .lp-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 360px; margin-bottom: 36px; font-weight: 300; }
        .lp-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px; }
        .lp-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; padding: 7px 16px; font-size: 12px; color: rgba(255,255,255,0.55); font-weight: 500; }
        .lp-stats { display: flex; gap: 36px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.07); }
        .lp-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 30px; color: #fff; letter-spacing: 1px; line-height: 1; }
        .lp-stat-label { font-size: 11px; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
        .lp-divider { width: 1px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent); z-index: 2; position: relative; }
        .lp-right { flex: 0.85; display: flex; align-items: center; justify-content: center; padding: 60px 48px; position: relative; z-index: 2; background: rgba(6,6,8,0.55); backdrop-filter: blur(40px); }
        .lp-form-wrap { width: 100%; max-width: 360px; }
        .lp-form-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #e94560; margin-bottom: 12px; }
        .lp-form-title { font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #fff; letter-spacing: 1px; line-height: 1; margin-bottom: 8px; }
        .lp-form-sub { font-size: 13px; color: rgba(255,255,255,0.3); margin-bottom: 32px; font-weight: 300; }
        .lp-error { background: rgba(233,69,96,0.1); border: 1px solid rgba(233,69,96,0.25); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #ff6b6b; margin-bottom: 20px; }
        .lp-input-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .lp-input-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.25); }
        .lp-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; width: 100%; }
        .lp-input::placeholder { color: rgba(255,255,255,0.18); }
        .lp-input:focus { border-color: rgba(233,69,96,0.5); background: rgba(233,69,96,0.04); box-shadow: 0 0 0 3px rgba(233,69,96,0.07); }
        .lp-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e94560 0%, #c0203d 100%); color: #fff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-top: 8px; transition: all 0.25s; box-shadow: 0 4px 20px rgba(233,69,96,0.3); }
        .lp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(233,69,96,0.45); }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .lp-footer { text-align: center; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.22); }
        .lp-footer a { color: #e94560; text-decoration: none; font-weight: 600; }
      `}</style>

      <div className="lp">
        <div className="lp-bg" />
        <div className="lp-overlay" />
        <div className="orb orb1" />
        <div className="orb orb2" />

        <div className="lp-left">
          <div className="lp-logo">
            <span className="lp-logo-icon">⚡</span>
            <span className="lp-logo-text">EventPulse</span>
          </div>
          <p className="lp-eyebrow">Live Events Platform</p>
          <h1 className="lp-title">
            Feel The<br />
            <em>Pulse</em><br />
            Of The City
          </h1>
          <p className="lp-sub">
            Discover, create and track events happening around you — all on one interactive map in real time.
          </p>
          <div className="lp-chips">
            {['🗺️ Live Map', '⭐ Reviews', '🔴 Real-time Status', '🔍 Smart Search'].map(f => (
              <span key={f} className="lp-chip">{f}</span>
            ))}
          </div>
          <div className="lp-stats">
            <div>
              <div className="lp-stat-num">2.4K+</div>
              <div className="lp-stat-label">Events</div>
            </div>
            <div>
              <div className="lp-stat-num">18K+</div>
              <div className="lp-stat-label">Users</div>
            </div>
            <div>
              <div className="lp-stat-num">94%</div>
              <div className="lp-stat-label">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="lp-divider" />

        <div className="lp-right">
          <div className="lp-form-wrap">
            <p className="lp-form-eyebrow">Welcome Back</p>
            <h2 className="lp-form-title">Sign In</h2>
            <p className="lp-form-sub">Enter your credentials to continue</p>
            {error && <div className="lp-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="lp-input-group">
                <label className="lp-input-label">Email Address</label>
                <input className="lp-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="lp-input-group">
                <label className="lp-input-label">Password</label>
                <input className="lp-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="lp-btn" disabled={loading}>
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