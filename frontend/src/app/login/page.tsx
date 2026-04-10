'use client';
import { useState, useEffect, useRef } from 'react';
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
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .lp-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Outfit', sans-serif;
          background: #050510;
          overflow: hidden;
          position: relative;
        }

        /* ── ANIMATED BACKGROUND BLOBS ── */
        .lp-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: blobFloat linear infinite;
          opacity: 0.5;
        }

        .blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #ff006644, #ff006600);
          top: -200px; left: -100px;
          animation-duration: 20s;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #7c3aed44, #7c3aed00);
          top: 30%; right: -150px;
          animation-duration: 25s;
          animation-delay: -8s;
        }
        .blob-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #0ea5e944, #0ea5e900);
          bottom: -100px; left: 30%;
          animation-duration: 18s;
          animation-delay: -4s;
        }
        .blob-4 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #f59e0b33, #f59e0b00);
          top: 60%; left: 10%;
          animation-duration: 22s;
          animation-delay: -12s;
        }

        @keyframes blobFloat {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(30px, -50px) scale(1.05); }
          50%  { transform: translate(-20px, 30px) scale(0.95); }
          75%  { transform: translate(50px, 20px) scale(1.02); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        /* ── NOISE OVERLAY ── */
        .lp-noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* ── GRID LINES ── */
        .lp-grid {
          position: fixed;
          inset: 0;
          z-index: 1;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── LEFT PANEL ── */
        .lp-left {
          flex: 1.4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          z-index: 2;
        }

        .lp-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          position: absolute;
          top: 48px;
          left: 80px;
          animation: fadeUp 0.6s ease both;
        }

        .lp-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ff0066, #7c3aed);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 20px rgba(255,0,102,0.4);
        }

        .lp-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 1px;
        }

        .lp-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,0,102,0.1);
          border: 1px solid rgba(255,0,102,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 600;
          color: #ff6699;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .lp-tag::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #ff0066;
          border-radius: 50%;
          box-shadow: 0 0 8px #ff0066;
          animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        .lp-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(52px, 6vw, 88px);
          font-weight: 800;
          line-height: 0.95;
          color: #fff;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .lp-headline .accent {
          background: linear-gradient(135deg, #ff0066, #7c3aed, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.35);
          line-height: 1.7;
          max-width: 400px;
          margin-bottom: 48px;
          font-weight: 300;
          animation: fadeUp 0.6s ease 0.3s both;
        }

        /* Feature Pills */
        .lp-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeUp 0.6s ease 0.4s both;
        }

        .lp-feature {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .lp-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .lp-feature-text {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
        }

        .lp-feature-text strong {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        /* ── DIVIDER ── */
        .lp-divider {
          width: 1px;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(255,255,255,0.06) 20%,
            rgba(255,255,255,0.06) 80%,
            transparent 100%
          );
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        /* ── RIGHT PANEL ── */
        .lp-right {
          flex: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          position: relative;
          z-index: 2;
        }

        /* ── GLASS CARD ── */
        .lp-glass {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 32px 64px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: fadeUp 0.6s ease 0.2s both;
          position: relative;
          overflow: hidden;
        }

        .lp-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }

        .lp-glass-glow {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(255,0,102,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-form-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;