import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Under Construction | Results.com',
  description: "This page is currently under construction. We're building something great.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden !important;
          background: #0d0d0d;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }

        .mc {
          height: 100vh; width: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: clamp(20px, 4vh, 48px) clamp(24px, 5vw, 80px);
          background: #0d0d0d;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative; overflow: hidden;
        }
        .glow-tl {
          position: absolute; top: -10%; left: -10%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(190,18,30,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .glow-br {
          position: absolute; bottom: -10%; right: -10%;
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(190,18,30,0.08) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .body {
          position: relative; z-index: 1;
          width: 100%; max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: center; flex: 1; min-height: 0;
        }
        .left { display: flex; flex-direction: column; align-items: flex-start; }
        .logo-wrap { margin-bottom: clamp(12px, 2vh, 24px); }
        .foundation-label {
          font-size: clamp(13px, 1.4vw, 18px);
          font-weight: 600; color: #be121e;
          letter-spacing: 1.5px;
          margin-top: 4px;
        }
        .uc-badge {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: clamp(14px, 2vh, 24px);
        }
        .uc-line { flex: 1; height: 1px; background: #be121e; max-width: 36px; }
        .uc-text {
          font-size: 10px; font-weight: 700;
          letter-spacing: 3px; color: #be121e;
          text-transform: uppercase;
        }
        .headline {
          font-size: clamp(22px, 3vw, 40px);
          font-weight: 800; color: #fff;
          line-height: 1.2; margin: 0 0 clamp(10px, 1.5vh, 18px);
        }
        .sub {
          font-size: clamp(13px, 1.1vw, 16px);
          color: #aaaaaa; line-height: 1.65;
          margin: 0 0 clamp(20px, 3vh, 32px);
          max-width: 400px;
        }
        .email-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #be121e; color: #fff;
          padding: clamp(11px, 1.6vh, 15px) clamp(22px, 2.5vw, 32px);
          border-radius: 50px; font-size: clamp(13px, 1.1vw, 15px);
          font-weight: 600; text-decoration: none;
          box-shadow: 0 4px 20px rgba(190,18,30,0.35);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .email-btn:hover {
          background: #d41423; transform: translateY(-2px);
          box-shadow: 0 6px 26px rgba(190,18,30,0.5);
        }
        .right { display: flex; flex-direction: column; gap: clamp(10px, 1.6vh, 16px); }
        .contacts-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; color: #666;
          text-transform: uppercase;
          margin-bottom: 2px; padding-left: 2px;
        }
        .card {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: clamp(14px, 2vh, 22px) clamp(18px, 2.5vw, 26px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          border-color: rgba(190,18,30,0.4);
          box-shadow: 0 6px 20px rgba(190,18,30,0.15);
        }
        .card-name {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; color: #888;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .phone {
          display: inline-flex; align-items: center; gap: 8px;
          color: #be121e; font-size: clamp(15px, 1.6vw, 19px);
          font-weight: 700; text-decoration: none;
          transition: color 0.2s;
        }
        .phone:hover { color: #e61928; }
        .footer {
          position: relative; z-index: 1;
          width: 100%; max-width: 1100px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          padding-top: clamp(10px, 1.5vh, 18px);
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 12px; color: #555; flex-shrink: 0;
        }

        @media (max-width: 820px) {
          html, body { overflow: auto !important; }
          .mc { height: auto; min-height: 100vh; padding: 28px 20px 24px; overflow: auto; }
          .body { grid-template-columns: 1fr; gap: 28px; text-align: center; margin-bottom: 28px; }
          .left { align-items: center; }
          .sub { max-width: 100%; }
          .right { max-width: 100%; }
          .uc-badge { justify-content: center; }
          .footer { flex-direction: column; gap: 6px; text-align: center; }
        }
      `}</style>

      <div className="mc">
        <div className="glow-tl" />
        <div className="glow-br" />

        <div className="body">
          {/* LEFT */}
          <div className="left">
            <div className="logo-wrap">
              <Image
                src="/images/r3sults-logo-white.png"
                alt="R3sults Foundation"
                width={220}
                height={70}
                priority
                style={{ width: 'clamp(160px, 18vw, 240px)', height: 'auto' }}
              />
            </div>

            <div className="uc-badge">
              <div className="uc-line" />
              <span className="uc-text">Under Construction</span>
              <div className="uc-line" />
            </div>

            <h1 className="headline">Our website is on its way.</h1>

            <p className="sub">
              We&apos;re building something great. In the meantime,
              reach out and we&apos;ll be happy to help.
            </p>

            <a href="mailto:info@r3sults.org" className="email-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              info@r3sults.org
            </a>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="contacts-label">Direct Contacts</div>

            <div className="card">
              <div className="card-name">Herb Tremble</div>
              <a href="tel:+13478746296" className="phone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.92-1.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +1 347 874 6296
              </a>
            </div>

            <div className="card">
              <div className="card-name">KT Catlin</div>
              <a href="tel:+19082299150" className="phone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.92-1.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +1 908 229 9150
              </a>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div>© 2026 R3sults Foundation. All rights reserved.</div>
          <div style={{ color: '#444' }}>Under Maintenance Mode</div>
        </footer>
      </div>
    </>
  )
}
