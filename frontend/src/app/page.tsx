'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { requestNotificationPermission, sendNotification } from '@/utils/notifications';
import { io } from 'socket.io-client';

const EventMap = dynamic(() => import('@/components/EventMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#12122a', color: '#555', fontSize: '16px' }}>
      🗺️ Loading map...
    </div>
  ),
});

export default function Home() {
  const { token, user, logout, ready } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [nightlifeMode, setNightlifeMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 4) setNightlifeMode(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!token) { router.push('/login'); return; }
    fetch('https://eventpulse-backend-b9ld.onrender.com/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, [token, ready, router]);

  useEffect(() => {
    if (!notificationsEnabled) return;
    const interval = setInterval(() => {
      fetch('https://eventpulse-backend-b9ld.onrender.com/api/events')
        .then(res => res.json())
        .then(data => {
          setEvents(prev => {
            if (data.length > prev.length) {
              sendNotification('New Event Near You! 📍', `${data[0].name} was just added!`);
            }
            return data;
          });
        });
    }, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!token) return;

    const socket = io('https://eventpulse-backend-b9ld.onrender.com');

    socket.on('eventCreated', (newEvent: any) => {
      setEvents(prev => {
        if (prev.find(e => e._id === newEvent._id)) return prev;
        return [newEvent, ...prev];
      });
    });

    socket.on('eventDeleted', ({ id }: { id: string }) => {
      setEvents(prev => prev.filter(e => e._id !== id));
    });

    return () => { socket.disconnect(); };
  }, [token]);

  if (!ready) return null;
  if (!token) return null;

  const handleLogout = () => { logout(); router.push('/login'); };

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) sendNotification('EventPulse 🔔', 'Notifications enabled!');
  };

  const categories = ['All', '🎵 Music', '💻 Tech', '⚽ Sports', '🎨 Art', '🍔 Food', '📚 Education', '🎉 Party', '🏃 Fitness'];

  const filtered = events.filter(e => {
    const matchesSearch = e.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const nightlifeCategories = ['🎵 Music', '🎉 Party', '🍔 Food'];
  const displayEvents = nightlifeMode
    ? filtered.filter(e => nightlifeCategories.includes(e.category))
    : filtered;

  const statusMap: Record<string, { label: string; color: string }> = {
    'upcoming':      { label: 'Upcoming',      color: '#4a9eff' },
    'starting-soon': { label: 'Starting Soon', color: '#f0a500' },
    'happening-now': { label: 'Happening Now', color: '#22c55e' },
    'finished':      { label: 'Finished',      color: '#555' },
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setEvents(prev => prev.filter((e: any) => e._id !== id));
  };

  return (
    <div style={styles.page}>

      {/* ── NAVBAR ── */}
      <nav style={styles.navbar}>
        {/* Logo */}
        <div style={styles.navLogo} onClick={() => router.push('/')}>
          <span style={styles.navIcon}>⚡</span>
          <span style={styles.navTitle}>Event<span style={styles.navAccent}>Pulse</span></span>
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={{ fontSize: '13px' }}>🔍</span>
          <input
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Right Actions */}
        <div style={styles.navActions}>
          <button
            onClick={() => setNightlifeMode(n => !n)}
            style={{
              ...styles.iconBtn,
              backgroundColor: nightlifeMode ? '#6c35de22' : 'transparent',
              borderColor: nightlifeMode ? '#6c35de' : '#2a2a45',
              color: nightlifeMode ? '#a78bfa' : '#666',
            }}
            title="Toggle Nightlife Mode"
          >
            {nightlifeMode ? '🌙' : '☀️'}
          </button>

          <button
            onClick={enableNotifications}
            style={{
              ...styles.iconBtn,
              backgroundColor: notificationsEnabled ? '#22c55e22' : 'transparent',
              borderColor: notificationsEnabled ? '#22c55e' : '#2a2a45',
              color: notificationsEnabled ? '#22c55e' : '#666',
            }}
            title="Enable Notifications"
          >
            {notificationsEnabled ? '🔔' : '🔕'}
          </button>

          <button onClick={() => router.push('/create-event')} style={styles.createBtn}>
            + Create Event
          </button>

          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={styles.userName}>{user?.name}</span>
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={styles.body}>

        {/* ── MAP ── */}
        <div style={styles.mapSection}>
          <EventMap events={displayEvents} setEvents={setEvents} token={token} nightMode={nightlifeMode} />
          <div style={styles.mapHint}>📍 Click anywhere on the map to add a new event</div>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <h2 style={styles.sidebarTitle}>
                {nightlifeMode ? '🌙 Nightlife' : 'Nearby Events'}
              </h2>
              <p style={styles.sidebarSub}>{displayEvents.length} of {events.length} events</p>
            </div>
            <div style={styles.countBadge}>{displayEvents.length}</div>
          </div>

          {/* Filters */}
          <div style={styles.filterWrap}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.filterBtn,
                  backgroundColor: activeCategory === cat ? '#e94560' : 'transparent',
                  color: activeCategory === cat ? '#fff' : '#666',
                  borderColor: activeCategory === cat ? '#e94560' : '#2a2a45',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Event List */}
          <div style={styles.eventList}>
            {displayEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '40px', margin: 0 }}>{nightlifeMode ? '🌙' : '🗺️'}</p>
                <p style={styles.emptyTitle}>{search ? 'No results found' : 'No events yet'}</p>
                <p style={styles.emptySub}>{search ? 'Try a different search' : 'Click the map to add one!'}</p>
              </div>
            ) : (
              displayEvents.map((event: any, i: number) => {
                const s = statusMap[event.status] || statusMap['upcoming'];
                return (
                  <div
                    key={event._id || event.id || i}
                    style={styles.eventCard}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = s.color;
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e30';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={styles.cardTop}>
                      <div style={{ ...styles.statusDot, backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                      <span style={{ ...styles.statusLabel, color: s.color }}>{s.label}</span>
                      {event.category && <span style={styles.catTag}>{event.category}</span>}
                    </div>
                    <p style={styles.eventName}>{event.name}</p>
                    {event.startTime && (
                      <p style={styles.eventMeta}>📅 {new Date(event.startTime).toLocaleDateString()}</p>
                    )}
                    {event.reviews?.length > 0 && (
                      <p style={styles.eventMeta}>
                        ⭐ {(event.reviews.reduce((s: number, r: any) => s + r.rating, 0) / event.reviews.length).toFixed(1)} · {event.reviews.length} review{event.reviews.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <button
                      onClick={() => router.push(`/events/${event._id || event.id}`)}
                      style={{ ...styles.viewBtn, borderColor: s.color, color: s.color }}
                    >
                      View Details →
                    </button>
                    {/* RSVP Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${event._id}/rsvp`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                        });
                        const data = await res.json();
                        setEvents(prev => prev.map((e: any) => e._id === data._id ? data : e));
                      }}
                      style={{
                        ...styles.rsvpBtn,
                        backgroundColor: event.attendees?.includes(user?.id) ? '#22c55e22' : 'transparent',
                        borderColor: event.attendees?.includes(user?.id) ? '#22c55e' : '#2a2a45',
                        color: event.attendees?.includes(user?.id) ? '#22c55e' : '#888',
                      }}
                    >
                      {event.attendees?.includes(user?.id) ? '✅ Going' : '🎟️ I\'m Going'}
                      {event.attendees?.length > 0 && ` · ${event.attendees.length}`}
                    </button>
                    <button onClick={() => handleDelete(event._id)} style={styles.deleteBtn}>
                      🗑️ Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#0a0a14', color: 'white', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' },
  navbar: { display: 'flex', alignItems: 'center', padding: '0 20px', height: '60px', background: 'linear-gradient(135deg, #12122a, #1a1a35)', borderBottom: '1px solid #1e1e35', boxShadow: '0 2px 20px rgba(0,0,0,0.4)', position: 'sticky', top: 0, zIndex: 1000, gap: '12px' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 },
  navIcon: { fontSize: '22px' },
  navTitle: { fontSize: '18px', fontWeight: 800, color: '#fff' },
  navAccent: { color: '#e94560' },
  searchWrap: { flex: 1, maxWidth: '360px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1e35', border: '1px solid #2a2a45', borderRadius: '10px', padding: '7px 12px' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%' },
  navActions: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 },
  iconBtn: { border: '1px solid', borderRadius: '8px', padding: '6px 10px', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1 },
  createBtn: { backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e1e35', padding: '4px 10px 4px 4px', borderRadius: '20px', border: '1px solid #2a2a45', flexShrink: 0 },
  userAvatar: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c23152)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' },
  userName: { fontSize: '12px', color: '#ccc', whiteSpace: 'nowrap' },
  logoutBtn: { backgroundColor: 'transparent', color: '#555', border: '1px solid #2a2a45', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  body: { display: 'flex', flex: 1, height: 'calc(100vh - 60px)', overflow: 'hidden' },
  mapSection: { flex: 1, position: 'relative', height: 'calc(100vh - 60px)', minHeight: '500px' },
  mapHint: { position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(8px)', color: '#aaa', fontSize: '12px', padding: '8px 16px', borderRadius: '20px', border: '1px solid #2a2a45', whiteSpace: 'nowrap', zIndex: 500 },
  sidebar: { width: '300px', minWidth: '300px', borderLeft: '1px solid #1e1e35', display: 'flex', flexDirection: 'column', backgroundColor: '#0d0d1f', overflow: 'hidden' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #1e1e35' },
  sidebarTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff' },
  sidebarSub: { margin: '2px 0 0', fontSize: '11px', color: '#555' },
  countBadge: { width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c23152)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' },
  filterWrap: { display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '10px 12px', borderBottom: '1px solid #1e1e35' },
  filterBtn: { border: '1px solid', borderRadius: '100px', padding: '4px 10px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' },
  eventList: { flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' },
  emptyState: { textAlign: 'center', padding: '40px 16px', color: '#aaa' },
  emptyTitle: { margin: '10px 0 4px', fontSize: '14px', fontWeight: 600, color: '#aaa' },
  emptySub: { margin: 0, fontSize: '11px', color: '#444', lineHeight: 1.5 },
  eventCard: { backgroundColor: '#12122a', border: '1px solid #1e1e30', borderRadius: '12px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s ease' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', flexWrap: 'wrap' },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0 },
  statusLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  catTag: { fontSize: '10px', color: '#777', backgroundColor: '#1e1e35', padding: '2px 6px', borderRadius: '8px', marginLeft: 'auto' },
  eventName: { margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#fff' },
  eventMeta: { margin: '3px 0 0', fontSize: '11px', color: '#555' },
  viewBtn: { backgroundColor: 'transparent', border: '1px solid', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '10px', width: '100%', transition: 'all 0.2s' },
  rsvpBtn: { backgroundColor: 'transparent', border: '1px solid', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '5px', width: '100%', transition: 'all 0.2s' },
  deleteBtn: { backgroundColor: 'transparent', color: '#444', border: '1px solid #2a2a45', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', marginTop: '5px', width: '100%' },
};