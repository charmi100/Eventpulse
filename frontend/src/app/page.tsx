'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { requestNotificationPermission, sendNotification } from '@/utils/notifications';

const EventMap = dynamic(() => import('@/components/EventMap'), {
  ssr: false,
  loading: () => <div style={styles.mapLoader}>🗺️ Loading map...</div>,
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
      .then(data => {
        const prevCount = events.length;
        setEvents(data);
        if (notificationsEnabled && data.length > prevCount) {
          sendNotification('New Event Added! 📍', `${data[0].name} was just added near you!`);
        }
      })
      .catch(err => console.error(err));
  }, [token, ready]);
  useEffect(() => {
    if (!notificationsEnabled) return;
    const interval = setInterval(() => {
      fetch('https://eventpulse-backend-b9ld.onrender.com/api/events')
        .then(res => res.json())
        .then(data => {
          setEvents(prev => {
            if (data.length > prev.length) {
              const newEvent = data[0];
              sendNotification('New Event Near You! 📍', `${newEvent.name} was just added!`);
            }
            return data;
          });
        });
    }, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled]);
  const handleLogout = () => { logout(); router.push('/login'); };

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
    'finished':      { label: 'Finished',      color: '#555'    },
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setEvents(prev => prev.filter((e: any) => e._id !== id));
  };
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      sendNotification('EventPulse 🔔', 'Notifications enabled! You will be notified of new events.');
    }
  };
  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.navIcon}>⚡</span>
          <span style={styles.navTitle}>Event<span style={styles.navTitleAccent}>Pulse</span></span>
        </div>
        <div style={styles.navCenter}>
          <div style={styles.searchWrap}>
            <span>🔍</span>
            <input
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={styles.userName}>{user?.name}</span>
          </div>
          <button
            onClick={() => setNightlifeMode(n => !n)}
            style={{
              ...styles.nightBtn,
              backgroundColor: nightlifeMode ? '#6c35de' : 'transparent',
              color: nightlifeMode ? '#fff' : '#666',
              borderColor: nightlifeMode ? '#6c35de' : '#2a2a45',
            }}
          >
            {nightlifeMode ? '🌙 Night' : '☀️ Day'}
            <button
  onClick={enableNotifications}
  style={{
    ...styles.nightBtn,
    backgroundColor: notificationsEnabled ? '#22c55e' : 'transparent',
    color: notificationsEnabled ? '#fff' : '#666',
    borderColor: notificationsEnabled ? '#22c55e' : '#2a2a45',
  }}
>
  {notificationsEnabled ? '🔔 On' : '🔕 Off'}
</button>
          </button>
          <button onClick={() => router.push('/create-event')} style={styles.createBtn}>
            + Create Event
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </nav>

      <div style={styles.body}>
        <div style={styles.mapSection}>
          <div style={styles.mapWrapper}>
          </div>
          <div style={styles.mapHint}>📍 Click anywhere on the map to add a new event</div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <h2 style={styles.sidebarTitle}>
                {nightlifeMode ? '🌙 Nightlife Events' : 'Nearby Events'}
              </h2>
              <p style={styles.sidebarSub}>{displayEvents.length} of {events.length} events</p>
            </div>
            <div style={styles.eventCountBadge}>{displayEvents.length}</div>
          </div>

          {/* Category Filters */}
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

          <div style={styles.eventList}>
            {displayEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '40px', margin: 0 }}>{nightlifeMode ? '🌙' : '🗺️'}</p>
                <p style={styles.emptyTitle}>
                  {nightlifeMode ? 'No nightlife events' : search ? 'No results found' : 'No events yet'}
                </p>
                <p style={styles.emptySub}>
                  {nightlifeMode ? 'No Music, Party or Food events found' : search ? 'Try a different search term' : 'Click the map to add your first event!'}
                </p>
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
                      <div style={{ ...styles.statusDot, backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                      <span style={{ ...styles.statusLabel, color: s.color }}>{s.label}</span>
                      {event.category && (
                        <span style={styles.categoryTag}>{event.category}</span>
                      )}
                    </div>
                    <p style={styles.eventName}>{event.name}</p>
                    <p style={styles.eventCoords}>
                      📍 {event.lat ? Number(event.lat).toFixed(4) : '?'}, {event.lng ? Number(event.lng).toFixed(4) : '?'}
                    </p>
                    {event.startTime && (
                      <p style={styles.eventDate}>
                        📅 {new Date(event.startTime).toLocaleDateString()}
                      </p>
                    )}
                    {event.reviews?.length > 0 && (
                      <p style={styles.reviewsHint}>
                        ⭐ {(event.reviews.reduce((s: number, r: any) => s + r.rating, 0) / event.reviews.length).toFixed(1)} · {event.reviews.length} review{event.reviews.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <button
                      onClick={() => router.push(`/events/${event._id || event.id}`)}
                      style={{ ...styles.viewBtn, borderColor: s.color, color: s.color }}
                    >
                      View Details →
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      style={styles.deleteBtn}
                    >
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
  navRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
    navLeft: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  navIcon: { fontSize: '24px' },
  navTitle: { fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' },
  navTitleAccent: { color: '#e94560' },
  navCenter: { flex: 1, maxWidth: '400px', margin: '0 auto' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1e35', border: '1px solid #2a2a45', borderRadius: '10px', padding: '8px 14px' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%' },
  navRights: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  userBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1e35', padding: '5px 12px 5px 5px', borderRadius: '20px', border: '1px solid #2a2a45' },
  userAvatar: { width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c23152)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' },
  userName: { fontSize: '13px', color: '#ccc', fontWeight: 500 }, 

  nightBtn: { 
    border: '1px solid', 
    borderRadius: '8px', 
    padding: '5px 10px', 
    fontSize: '11px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
    logoutBtn: { backgroundColor: 'transparent', color: '#666', border: '1px solid #2a2a45', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' },
  createBtn: { backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  body: { display: 'flex', flex: 1, height: 'calc(100vh - 60px)', overflow: 'hidden' },
  mapSection: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' },
  mapWrapper: { flex: 1, height: 'calc(100vh - 60px)', position: 'relative' },
  mapHint: { position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(8px)', color: '#aaa', fontSize: '12px', padding: '8px 16px', borderRadius: '20px', border: '1px solid #2a2a45', whiteSpace: 'nowrap', zIndex: 500 },
  mapLoader: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#12122a', color: '#555' },
  sidebar: { width: '320px', minWidth: '320px', borderLeft: '1px solid #1e1e35', display: 'flex', flexDirection: 'column', backgroundColor: '#0d0d1f', overflow: 'hidden' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #1e1e35' },
  sidebarTitle: { margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' },
  sidebarSub: { margin: '2px 0 0', fontSize: '12px', color: '#555' },
  eventCountBadge: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c23152)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' },
  filterWrap: { display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '12px 16px', borderBottom: '1px solid #1e1e35' },
  filterBtn: { border: '1px solid', borderRadius: '100px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' },
  eventList: { flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  emptyState: { textAlign: 'center', padding: '48px 20px', color: '#aaa' },
  emptyTitle: { margin: '12px 0 4px', fontSize: '15px', fontWeight: 600, color: '#aaa' },
  emptySub: { margin: 0, fontSize: '12px', color: '#444', lineHeight: 1.5 },
  eventCard: { backgroundColor: '#12122a', border: '1px solid #1e1e30', borderRadius: '12px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s ease' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  statusLabel: { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  categoryTag: { fontSize: '10px', color: '#888', backgroundColor: '#1e1e35', padding: '2px 8px', borderRadius: '10px', marginLeft: 'auto' },
  eventName: { margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#fff' },
  eventCoords: { margin: 0, fontSize: '11px', color: '#444' },
  eventDate: { margin: '4px 0 0', fontSize: '11px', color: '#666' },
  reviewsHint: { margin: '6px 0 0', fontSize: '12px', color: '#888' },
  viewBtn: { backgroundColor: 'transparent', border: '1px solid', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '12px', width: '100%', transition: 'all 0.2s' },
  deleteBtn: { backgroundColor: 'transparent', color: '#555', border: '1px solid #2a2a45', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', marginTop: '6px', width: '100%', transition: 'all 0.2s' },
};