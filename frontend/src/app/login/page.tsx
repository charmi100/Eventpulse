'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
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

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      router.push('/');
    } catch {
      setError('Server error');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body { margin:0; background:#050507; font-family:sans-serif; }

        .login-container {
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
        }

        .glow1, .glow2 {
          position:absolute;
          border-radius:50%;
          filter:blur(120px);
        }

        .glow1 {
          width:500px; height:500px;
          background:rgba(233,69,96,0.3);
          top:-150px; left:-100px;
        }

        .glow2 {
          width:400px; height:400px;
          background:rgba(100,80,255,0.3);
          bottom:-100px; right:-100px;
        }

        .card {
          background:rgba(255,255,255,0.05);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.1);
          padding:40px;
          border-radius:16px;
          width:320px;
          color:white;
          z-index:2;
        }

        h1 { margin-bottom:10px; }
        p { color:#aaa; font-size:14px; }

        input {
          width:100%;
          padding:12px;
          margin-top:10px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.05);
          color:white;
        }

        button {
          width:100%;
          margin-top:15px;
          padding:12px;
          border:none;
          border-radius:8px;
          background:linear-gradient(135deg,#e94560,#c0203d);
          color:white;
          cursor:pointer;
        }

        .error {
          background:#ff4d4d22;
          padding:10px;
          margin-bottom:10px;
          border-radius:6px;
          color:#ff6b6b;
        }

        a { color:#e94560; }
      `}</style>

      <div className="login-container">
        <div className="glow1"></div>
        <div className="glow2"></div>

        <div className="card">
          <h1>Welcome back</h1>
          <p>Login to continue</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button>{loading ? 'Signing...' : 'Login →'}</button>
          </form>

          <p style={{marginTop:'15px'}}>
            No account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </>
  );
}