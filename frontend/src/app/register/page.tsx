'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060608; }
        .rp { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #060608; overflow: hidden; position: relative; }
        .rp-bg { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1540039155733-5bb30b4db9a2?w=1920&q=80'); background-size: cover; background-position: center; opacity: 0.2; z-index: 0; }
        .rp-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(6,6,8,0.95) 40%, rgba(6,6,8,0.7) 100%); z-index: 1; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); z-index: 1; pointer-events: none; }
        .orb1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%); top: -150px; left: -100px; }
        .orb2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(80,40,180,0.2) 0%, transparent 70%); bottom: -100px; right: 300px; }

        .rp-left { flex: 1.3; display: flex; flex-direction: column; justify-content: flex-end; padding: 60px; position: relative; z-index: 2; }
        .rp-logo { position: absolute; top: 48px; left: 60px; display: flex; align-items: center; gap: 10px; }
        .rp-logo-icon { font-size: 26px; }
        .rp-logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #fff; letter-spacing: 3px; }
        .rp-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #e94560; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .rp-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: #e94560; }
        .rp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 7vw, 96px); line-height: 0.92; color: #fff; letter-spacing: 2px; margin-bottom: 20px; }
        .rp-title em { color: #e94560; font-style: normal; }
        .rp-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 360px; margin-bottom: 36px; font-weight: 300; }
        .rp-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px; }
        .rp-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; padding: 7px 16px; font-size: 12px; color: rgba(255,255,255,0.55); font-weight: 500; }
        .rp-steps { display: flex; flex-direction: column; gap: 16px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.07); }
        .rp-step { display: flex; align-items: center; gap: 14px; }
        .rp-step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #e94560; flex-shrink: 0; }
        .rp-step-text { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 300; }

        .rp-divider { width: 1px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent); z-index: 2; position: relative; }

        .rp-right { flex: 0.85; display: flex; align-items: center; justify-content: center; padding: 60px 48px; position: relative; z-index: 2; background: rgba(6,6,8,0.55); backdrop-filter: blur(40px); }
        .rp-form-wrap { width: 100%; max-width: 360px; }
        .rp-form-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #e94560; margin-bottom: 12px; }
        .rp-form-title { font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #fff; letter-spacing: 1px; line-height: 1; margin-bottom: 8px; }
        .rp-form-sub { font-size: 13px; color: rgba(255,255,255,0.3); margin-bottom: 32px; font-weight: 300; }
        .rp-error { background: rgba(233,69,96,0.1); border: 1px solid rgba(233,69,96,0.25); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #ff6b6b; margin-bottom: 20px; }
        .rp-input-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .rp-input-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.25); }
        .rp-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; width: 100%; }
        .rp-input::placeholder { color: rgba(255,255,255,0.18); }
        .rp-input:focus { border-color: rgba(233,69,96,0.5); background: rgba(233,69,96,0.04); box-shadow: 0 0 0 3px rgba(233,69,96,0.07); }
        .rp-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e94560 0%, #c0203d 100%); color: #fff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-top: 8px; transition: all 0.25s; box-shadow: 0 4px 20px rgba(233,69,96,0.3); }
        .rp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(233,69,96,0.45); }
        .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .rp-footer { text-align: center; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.22); }
        .rp-footer a { color: #e94560; text-decoration: none; font-weight: 600; }
      `}</style>

      <div className="rp">
        <div className="rp-bg" />
        <div className="rp-overlay" />
        <div className="orb orb1" />
        <div className="orb orb2" />

        {/* LEFT */}
        <div className="rp-left">
          <div className="rp-logo">
            <span className="rp-logo-icon">⚡</span>
            <span className="rp-logo-text">EventPulse</span>
          </div>

          <p className="rp-eyebrow">Join The Community</p>
          <h1 className="rp-title">
            Your City<br />
            <em>Awaits</em><br />
            You Now
          </h1>
          <p className="rp-sub">
            Create your free account and start discovering events happening right around you.
          </p>

          <div className="rp-chips">
            {['🎯 Free Forever', '🗺️ Live Map', '⭐ Reviews', '🔔 Notifications'].map(f => (
              <span key={f} className="rp-chip">{f}</span>
            ))}
          </div>

          <div className="rp-steps">
            {[
              'Create your free account',
              'Explore events on the map',
              'Add & review events',
            ].map((step, i) => (
              <div key={i} className="rp-step">
                <div className="rp-step-num">{i + 1}</div>
                <div className="rp-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-divider" />

        {/* RIGHT */}
        <div className="rp-right">
          <div className="rp-form-wrap">
            <p className="rp-form-eyebrow">Get Started</p>
            <h2 className="rp-form-title">Create Account</h2>
            <p className="rp-form-sub">Join thousands of event explorers</p>

            {error && <div className="rp-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="rp-input-group">
                <label className="rp-input-label">Full Name</label>
                <input
                  className="rp-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="rp-input-group">
                <label className="rp-input-label">Email Address</label>
                <input
                  className="rp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="rp-input-group">
                <label className="rp-input-label">Password</label>
                <input
                  className="rp-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="rp-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <p className="rp-footer">
              Already have an account? <a href="/login">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}