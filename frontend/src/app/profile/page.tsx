'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'attending'>('created');

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={styles.loading}>⏳ Loading profile...</div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a14; }
        .profile-page { min-height: 100vh; background: #0a0a14; font-family: 'DM Sans', sans-serif; color: #fff; }
        .profile-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 32px; height: 60px; background: linear-gradient(135deg, #12122a, #1a1a35); border-bottom: 1px solid #1e1e35; }
        .profile-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #fff; letter-spacing: 2px; cursor: pointer; }
        .profile-nav-logo em { color: #e94560; font-style: normal; }
        .profile-back { background: transparent; border: 1px solid #2a2a45; color: #aaa; padding: 7px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .profile-container { max-width: 800px; margin: 40px auto; padding: 0 24px; }

        /* Hero Card */
        .profile-hero { background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid #2a2a3e; border-radius: 20px; padding: 40px; display: flex; align-items: center; gap: 32px; margin-bottom: 32px; position: relative; overflow: hidden; }
        .profile-hero::before { content: ''; position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%); border-radius: 50%; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #e94560, #c23152); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 8px 24px rgba(233,69,96,0.3); }
        .profile-info h1 { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 1px; margin-bottom: 4px; }
        .profile-info p { color: #666; font-size: 14px; margin-bottom: 16px; }
        .profile-stats { display: flex; gap: 24px; }
        .profile-stat { text-align: center; }
        .profile-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #e94560; }
        .profile-stat-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; }

        /* Tabs */
        .profile-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .profile-tab { background: transparent; border: 1px solid #2a2a45; color: #666; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .profile-tab.active { background: #e94560; border-color: #e94560; color: #fff; }

        /* Event Cards */
        .profile-events { display: flex; flex-direction: column; gap: 12px; }
        .profile-event-card { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; cursor: pointer; }
        .profile-event-card:hover { border-color: #e94560; transform: translateY(-2px); }
        .profile-event-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .profile-event-meta { font-size: 12px; color: #555; }
        .profile-event-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .profile-empty { text-align: center; padding: 48px; color: #555; background: #1a1a2e; border-radius: 12px; border: 1px dashed #2a2a3e; }

        .logout-btn { background: transparent; border: 1px solid #e94560; color: #e94560; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-top: 20px; }
      `}</style>

      <div className="profile-page">
        {/* Navbar */}
        <nav className="profile-nav">
          <button className="profile-back" onClick={() => router.push('/')}>← Back to Map</button>
          <div className="profile-nav-logo">⚡ Event<em>Pulse</em></div>
          <div />
        </nav>

        <div className="profile-container">
          {/* Hero */}
          <div className="profile-hero">
            <div className="profile-avatar">
              {profile?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{profile?.user?.name}</h1>
              <p>{profile?.user?.email}</p>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-num">{profile?.createdEvents?.length || 0}</div>
                  <div className="profile-stat-label">Events Created</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-num">{profile?.attendingEvents?.length || 0}</div>
                  <div className="profile-stat-label">Attending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'created' ? 'active' : ''}`}
              onClick={() => setActiveTab('created')}
            >
              📍 Created Events ({profile?.createdEvents?.length || 0})
            </button>
            <button
              className={`profile-tab ${activeTab === 'attending' ? 'active' : ''}`}
              onClick={() => setActiveTab('attending')}
            >
              🎟️ Attending ({profile?.attendingEvents?.length || 0})
            </button>
          </div>

          {/* Event List */}
          <div className="profile-events">
            {activeTab === 'created' && (
              profile?.createdEvents?.length === 0 ? (
                <div className="profile-empty">
                  <p style={{ fontSize: '32px' }}>📭</p>
                  <p style={{ marginTop: '8px' }}>No events created yet</p>
                  <button
                    onClick={() => router.push('/create-event')}
                    style={{ marginTop: '16px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    + Create your first event
                  </button>
                </div>
              ) : (
                profile?.createdEvents?.map((event: any) => (
                  <div
                    key={event._id}
                    className="profile-event-card"
                    onClick={() => router.push(`/events/${event._id}`)}
                  >
                    <div>
                      <p className="profile-event-name">{event.name}</p>
                      <p className="profile-event-meta">
                        📅 {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'No date'}
                        &nbsp;·&nbsp;
                        {event.category || 'General'}
                        &nbsp;·&nbsp;
                        {event.attendees?.length || 0} attending
                      </p>
                    </div>
                    <span
                      className="profile-event-badge"
                      style={{
                        backgroundColor: event.status === 'happening-now' ? '#22c55e22' : '#4a9eff22',
                        color: event.status === 'happening-now' ? '#22c55e' : '#4a9eff',
                        border: `1px solid ${event.status === 'happening-now' ? '#22c55e' : '#4a9eff'}`,
                      }}
                    >
                      {event.status || 'upcoming'}
                    </span>
                  </div>
                ))
              )
            )}

            {activeTab === 'attending' && (
              profile?.attendingEvents?.length === 0 ? (
                <div className="profile-empty">
                  <p style={{ fontSize: '32px' }}>🎟️</p>
                  <p style={{ marginTop: '8px' }}>Not attending any events yet</p>
                  <button
                    onClick={() => router.push('/')}
                    style={{ marginTop: '16px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                profile?.attendingEvents?.map((event: any) => (
                  <div
                    key={event._id}
                    className="profile-event-card"
                    onClick={() => router.push(`/events/${event._id}`)}
                  >
                    <div>
                      <p className="profile-event-name">{event.name}</p>
                      <p className="profile-event-meta">
                        📅 {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'No date'}
                        &nbsp;·&nbsp;
                        {event.category || 'General'}
                      </p>
                    </div>
                    <span style={{ fontSize: '20px' }}>🎟️</span>
                  </div>
                ))
              )
            )}
          </div>

          <button
            className="logout-btn"
            onClick={() => { logout(); router.push('/login'); }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  loading: {
    minHeight: '100vh',
    backgroundColor: '#0a0a14',
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontFamily: 'Segoe UI, sans-serif',
  } as React.CSSProperties,
};