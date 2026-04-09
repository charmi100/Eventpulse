'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        body {
          margin:0;
          font-family:sans-serif;
          background:#050507;
          color:white;
        }

        .hero {
          height:100vh;
          background-image:url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920');
          background-size:cover;
          background-position:center;
          position:relative;
          display:flex;
          align-items:center;
          padding:60px;
        }

        .overlay {
          position:absolute;
          inset:0;
          background:linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3));
        }

        .content {
          position:relative;
          z-index:2;
          max-width:600px;
        }

        h1 {
          font-size:70px;
          margin:0;
        }

        p {
          color:#bbb;
          margin-top:10px;
        }

        .buttons {
          margin-top:20px;
          display:flex;
          gap:10px;
        }

        button {
          padding:12px 20px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          font-weight:600;
        }

        .primary {
          background:#e94560;
          color:white;
        }

        .secondary {
          background:transparent;
          border:1px solid white;
          color:white;
        }

        /* SCROLL SECTION */
        .section {
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:40px;
        }

      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="overlay"></div>

        <div className="content">
          <h1>EventPulse</h1>
          <p>See your city come alive.</p>

          <div className="buttons">
            <button className="primary" onClick={()=>router.push('/register')}>
              Join the City →
            </button>
            <button className="secondary" onClick={()=>router.push('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* SCROLL SECTIONS */}
      <section className="section">🗺️ Explore Live Map</section>
      <section className="section">🎉 Discover Events</section>
      <section className="section">🔥 Join the Crowd</section>

    </>
  );
}