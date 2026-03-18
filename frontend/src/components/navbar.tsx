'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#1a1a2e',
      color: 'white',
    }}>
      {/* Logo */}
      <h2
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer', margin: 0 }}
      >
        ⚡ EventPulse
      </h2>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/" style={linkStyle}>Home</a>

        {user ? (
          // ── LOGGED IN ──────────────────────────
          <>
            <a href="/create-event" style={linkStyle}>+ Create Event</a>
            <span style={{ color: '#aaa' }}>Hi, {user.name} 👋</span>
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        ) : (
          // ── NOT LOGGED IN ──────────────────────
          <>
            <a href="/login"    style={linkStyle}>Login</a>
            <a href="/register" style={btnStyle}>Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '15px',
};

const btnStyle: React.CSSProperties = {
  backgroundColor: '#e94560',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  textDecoration: 'none',
};