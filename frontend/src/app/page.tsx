'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

const EventMap = dynamic(() => import('@/components/EventMap'), {
  ssr: false,
  loading: () => (
    <div style={styles.mapLoader}>🗺️ Loading map...</div>
  ),
});

export default function Home() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch('http://localhost:8080/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, [token]);

  if (!token) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div style={styles.page}>

      {/* ── NAVBAR ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>⚡ EventPulse</div>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name} 👋</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={styles.content}>

        {/* ── LEFT: MAP ── */}
        <div style={styles.mapSection}>
          <h2 style={styles.sectionTitle}>🗺️ Event Map</h2>
          <p style={styles.sectionSub}>Click anywhere on the map to add an event</p>
          <div style={styles.mapWrapper}>
            <EventMap events={events} setEvents={setEvents} />
          </div>
        </div>

        {/* ── RIGHT: EVENTS LIST ── */}
        <div style={styles.listSection}>
          <h2 style={styles.sectionTitle}>📋 Events</h2>
          <p style={styles.sectionSub}>{events.length} event{events.length !== 1 ? 's' : ''} found</p>

          <div style={styles.eventList}>
            {events.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No events yet.</p>
                <p style={{ fontSize: '13px', color: '#666' }}>Click on the map to add one!</p>
              </div>
            ) : (
              events.map((event: any) => (
                <div key={event.id} style={styles.eventCard}>
                  <div style={styles.eventIcon}>📍</div>
                  <div>
                    <p style={styles.eventName}>{event.name}</p>
                    <p style={styles.eventCoords}>
                    {event.lat ? Number(event.lat).toFixed(4) : '?'}, {event.lng ? Number(event.lng).toFixed(4) : '?'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    color: 'white',
    fontFamily: "'Segoe UI', sans-serif",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1a1a2e',
    borderBottom: '1px solid #2a2a3e',
  },
  navLogo: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcome: {
    color: '#aaa',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    gap: '24px',
    padding: '32px',
    height: 'calc(100vh - 65px)',
  },
  mapSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    color: '#fff',
  },
  sectionSub: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  mapWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #2a2a3e',
    flex: 1,
  },
  mapLoader: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    color: '#666',
    fontSize: '16px',
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
  },
  emptyState: {
    textAlign: 'center',
    color: '#aaa',
    padding: '40px 20px',
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    border: '1px solid #2a2a3e',
  },
  eventCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a3e',
    borderRadius: '10px',
    padding: '14px 16px',
    transition: 'border 0.2s',
  },
  eventIcon: {
    fontSize: '20px',
  },
  eventName: {
    margin: 0,
    fontWeight: 600,
    fontSize: '14px',
    color: '#fff',
  },
  eventCoords: {
    margin: 0,
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
};