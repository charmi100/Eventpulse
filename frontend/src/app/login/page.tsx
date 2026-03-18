'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {  // ✅ login not register
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),  // ✅ no name field
      });
  
      const data = await res.json();
      console.log('Response:', res.status, data);
  
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
  
      login(data.token, data.user);
      router.push('/');
  
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Cannot connect to server. Is your backend running?');
      setLoading(false);
    }
  };
  return (
    <div style={styles.page}>

      {/* Card */}
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>EventPulse</h1>
        </div>

        <p style={styles.subtitle}>Welcome back! Sign in to continue</p>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <a href="/register" style={styles.link}>Create one</a>
        </p>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    border: '1px solid #2a2a3e',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '32px',
    marginTop: '4px',
  },
  error: {
    backgroundColor: '#ff4d4d22',
    border: '1px solid #ff4d4d55',
    color: '#ff6b6b',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#aaa',
    fontSize: '13px',
    fontWeight: 500,
  },
  input: {
    backgroundColor: '#0f0f1a',
    border: '1px solid #2a2a3e',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  btn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background 0.2s',
  },
  footer: {
    color: '#666',
    fontSize: '13px',
    textAlign: 'center',
    marginTop: '24px',
  },
  link: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: 500,
  },
};