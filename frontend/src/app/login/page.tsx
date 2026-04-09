'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Lenis from 'lenis';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Smooth scroll (Pinterest feel)
  useEffect(() => {
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
});
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // ✅ Save auth properly
      login(data.token, data.user);

      // ✅ Redirect to dashboard
      router.push('/dashboard');

    } catch {
      setError('Cannot connect to server');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin:0;
          font-family: 'DM Sans', sans-serif;
          background:#000;
          color:white;
          overflow-x:hidden;
        }

        section {
          height:100vh;
          position:relative;
        }

        /* HERO */
        .hero {
          background-image:url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920');
          background-size:cover;
          background-position:center;
          display:flex;
          align-items:center;
          padding:80px;
        }

        .overlay {
          position:absolute;
          inset:0;
          background:linear-gradient(120deg, rgba(0,0,0,0.9), rgba(0,0,0,0.3));
        }

        .hero-content {
          position:relative;
          z-index:2;
          max-width:600px;
        }

        .title {
          font-size:80px;
          line-height:1;
          font-weight:800;
        }

        .subtitle {
          color:#aaa;
          margin-top:10px;
        }

        /* LOGIN CARD */
        .login-card {
          position:absolute;
          right:80px;
          top:50%;
          transform:translateY(-50%);
          width:320px;
          padding:30px;
          border-radius:20px;
          background:rgba(255,255,255,0.05);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.1);
          box-shadow:0 20px 80px rgba(0,0,0,0.6);
        }

        input {
          width:100%;
          padding:12px;
          margin-top:10px;
          border-radius:8px;
          border:none;
          background:#111;
          color:white;
        }

        button {
          width:100%;
          margin-top:15px;
          padding:12px;
          border:none;
          border-radius:8px;
          background:#e94560;
          color:white;
          font-weight:600;
          cursor:pointer;
          transition:0.2s;
        }

        button:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 25px rgba(233,69,96,0.4);
        }

        .error {
          color:#ff6b6b;
          font-size:12px;
          margin-top:10px;
        }

        /* SCROLL SECTIONS */
        .section {
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:40px;
          background:#050507;
        }

      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <div className="title">EventPulse</div>
          <div className="subtitle">See what's happening around you in real-time</div>
        </div>

        {/* LOGIN */}
        <div className="login-card">
          <h2>Sign In</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Enter →'}
          </button>

          {error && <p className="error">{error}</p>}

          <p style={{fontSize:'12px',marginTop:'10px'}}>
            New here?{' '}
            <span
              style={{color:'#e94560',cursor:'pointer'}}
              onClick={()=>router.push('/register')}
            >
              Join the city
            </span>
          </p>
        </div>
      </section>

      {/* SCROLL EXPERIENCE */}
      <section className="section">🗺️ Explore city map</section>
      <section className="section">🎉 Discover live events</section>
      <section className="section">🔥 Feel the crowd energy</section>

    </>
  );
}