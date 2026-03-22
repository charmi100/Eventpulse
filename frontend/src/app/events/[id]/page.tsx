'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function EventDetailsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}`)
      .then(res => res.json())
      .then(data => { setEvent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, id]);

  if (loading) return <div style={styles.loading}>Loading event...</div>;
  if (!event)  return <div style={styles.loading}>Event not found 😕</div>;

  const statusMap: Record<string, { label: string; color: string; emoji: string }> = {
    'upcoming':      { label: 'Upcoming',      color: '#4a9eff', emoji: '🔵' },
    'starting-soon': { label: 'Starting Soon', color: '#f0a500', emoji: '🟡' },
    'happening-now': { label: 'Happening Now', color: '#22c55e', emoji: '🟢' },
    'finished':      { label: 'Finished',      color: '#666',    emoji: '🔴' },
  };
  const s = statusMap[event.status] || statusMap['upcoming'];

  const avgRating = event.reviews?.length
    ? (event.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / event.reviews.length).toFixed(1)
    : null;

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment, name: user?.name }),
    });
    const data = await res.json();
    setEvent(data);
    setComment('');
    setRating(5);
    setSubmitting(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    setEvent(data);
  };

  const handleStatusUpdate = async (status: string) => {
    const res = await fetch(`https://eventpulse-backend-b9ld.onrender.com/api/events/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setEvent(data);
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <button onClick={() => router.push('/')} style={styles.backBtn}>← Back to Map</button>
        <span style={styles.navLogo}>⚡ EventPulse</span>
        <div />
      </nav>

      <div style={styles.container}>

        {/* ── EVENT CARD ── */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h1 style={styles.eventName}>{event.name}</h1>
              <p style={styles.eventDate}>
                📅 {event.startTime ? new Date(event.startTime).toLocaleString() : 'No date set'}
              </p>
              {avgRating && (
                <p style={styles.avgRating}>
                  ⭐ {avgRating} / 5 &nbsp;
                  <span style={{ color: '#555', fontSize: '12px' }}>
                    ({event.reviews.length} review{event.reviews.length !== 1 ? 's' : ''})
                  </span>
                </p>
              )}
            </div>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: s.color + '22',
              color: s.color,
              border: `1px solid ${s.color}55`,
            }}>
              {s.emoji} {s.label}
            </span>
          </div>

          <div style={styles.divider} />

          {/* Details Grid */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>📍 Location</p>
              <p style={styles.detailValue}>{event.lat?.toFixed(4)}, {event.lng?.toFixed(4)}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>⏰ Start Time</p>
              <p style={styles.detailValue}>{event.startTime ? new Date(event.startTime).toLocaleTimeString() : 'TBD'}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>🏁 End Time</p>
              <p style={styles.detailValue}>{event.endTime ? new Date(event.endTime).toLocaleTimeString() : 'TBD'}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>📊 Status</p>
              <p style={{ ...styles.detailValue, color: s.color }}>{s.label}</p>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Status Buttons */}
          <p style={styles.detailLabel}>Update Status</p>
          <div style={styles.statusBtns}>
            {Object.entries(statusMap).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleStatusUpdate(key)}
                style={{
                  ...styles.statusBtn,
                  borderColor: val.color,
                  color: event.status === key ? '#fff' : val.color,
                  backgroundColor: event.status === key ? val.color : 'transparent',
                }}
              >
                {val.emoji} {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>⭐ Reviews</h2>

          {/* Add Review Form */}
          <form onSubmit={handleReview} style={styles.reviewForm}>
            {/* Star Rating */}
            <div style={styles.starsRow}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '28px',
                    cursor: 'pointer',
                    color: star <= rating ? '#f0a500' : '#333',
                    transition: 'color 0.1s',
                  }}
                >
                  ★
                </span>
              ))}
              <span style={{ color: '#666', fontSize: '13px', marginLeft: '8px' }}>
                {rating}/5
              </span>
            </div>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              style={styles.textarea}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>

          <div style={styles.divider} />

          {/* Reviews List */}
          {event.reviews?.length === 0 ? (
            <div style={styles.emptyReviews}>
              <p>No reviews yet — be the first! 🌟</p>
            </div>
          ) : (
            <div style={styles.reviewList}>
              {event.reviews?.map((review: any) => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewLeft}>
                      <div style={styles.reviewAvatar}>
                        {review.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p style={styles.reviewName}>{review.name || 'Anonymous'}</p>
                        <p style={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div style={styles.reviewRight}>
                      <span style={styles.reviewStars}>
                        {'★'.repeat(review.rating)}
                        <span style={{ color: '#333' }}>
                          {'★'.repeat(5 - review.rating)}
                        </span>
                      </span>
                      {review.user === user?.id && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={styles.deleteBtn}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
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
  loading: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: '64px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderBottom: '1px solid #2a2a3e',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#aaa',
    border: '1px solid #2a2a3e',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  navLogo: {
    fontSize: '20px',
    fontWeight: 700,
  },
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #2a2a3e',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  eventName: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
  },
  eventDate: {
    margin: '8px 0 0',
    color: '#666',
    fontSize: '13px',
  },
  avgRating: {
    margin: '6px 0 0',
    fontSize: '16px',
    color: '#f0a500',
    fontWeight: 600,
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  divider: {
    height: '1px',
    backgroundColor: '#2a2a3e',
    margin: '24px 0',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailBox: {
    backgroundColor: '#0f0f1a',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid #2a2a3e',
  },
  detailLabel: {
    margin: 0,
    fontSize: '12px',
    color: '#555',
    marginBottom: '6px',
  },
  detailValue: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  statusBtns: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '12px',
  },
  statusBtn: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  sectionTitle: {
    margin: '0 0 20px',
    fontSize: '18px',
    fontWeight: 600,
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  starsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  textarea: {
    backgroundColor: '#0f0f1a',
    border: '1px solid #2a2a3e',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
    outline: 'none',
    fontFamily: "'Segoe UI', sans-serif",
  },
  submitBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  emptyReviews: {
    textAlign: 'center',
    color: '#555',
    padding: '24px',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    backgroundColor: '#0f0f1a',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid #2a2a3e',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  reviewLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  reviewAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e94560',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    flexShrink: 0,
  },
  reviewName: {
    margin: 0,
    fontWeight: 600,
    fontSize: '14px',
  },
  reviewDate: {
    margin: 0,
    fontSize: '11px',
    color: '#555',
  },
  reviewRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  reviewStars: {
    color: '#f0a500',
    fontSize: '16px',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  reviewComment: {
    margin: 0,
    fontSize: '14px',
    color: '#ccc',
    lineHeight: '1.5',
  },
};