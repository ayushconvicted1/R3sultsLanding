import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Construction | Results.com',
  description: "This page is currently under construction. We're building something great.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          background-color: #080808;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }

        .m-container {
          height: 100vh;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(16px, 3.5vh, 40px) clamp(24px, 4vw, 64px);
          background: #080808;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .m-glow-1 {
          position: absolute;
          top: -15%;
          left: -15%;
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(190, 18, 30, 0.14) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .m-glow-2 {
          position: absolute;
          bottom: -15%;
          right: -15%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(190, 18, 30, 0.10) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .m-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 5vw, 64px);
          align-items: center;
          flex: 1;
          min-height: 0;
        }

        .m-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .m-right {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.8vh, 16px);
          width: 100%;
          max-width: 440px;
          justify-self: end;
        }

        .m-card {
          background: rgba(22, 22, 22, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: clamp(14px, 2.2vh, 22px) clamp(18px, 2.5vw, 26px);
          backdrop-filter: blur(12px);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .m-card:hover {
          transform: translateY(-2px);
          border-color: rgba(190, 18, 30, 0.4);
          box-shadow: 0 8px 24px -6px rgba(190, 18, 30, 0.2);
        }

        .m-email-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #be121e;
          color: #ffffff;
          padding: clamp(12px, 1.8vh, 15px) clamp(24px, 2.5vw, 34px);
          border-radius: 50px;
          font-size: clamp(13px, 1.2vw, 15px);
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 18px rgba(190, 18, 30, 0.35);
        }

        .m-email-btn:hover {
          background-color: #d41423;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(190, 18, 30, 0.5);
        }

        .m-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #be121e;
          font-size: clamp(16px, 1.8vw, 19px);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .m-phone-link:hover {
          color: #e61928;
        }

        .m-footer {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: clamp(12px, 2vh, 20px);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 12px;
          color: #555;
          flex-shrink: 0;
        }

        @media (max-width: 860px) {
          html, body {
            overflow: auto !important;
          }
          .m-container {
            height: auto;
            min-height: 100vh;
            padding: 24px 20px 20px;
            overflow: auto;
          }
          .m-content {
            grid-template-columns: 1fr;
            gap: 24px;
            text-align: center;
            margin-bottom: 24px;
          }
          .m-left {
            align-items: center;
          }
          .m-right {
            max-width: 100%;
            justify-self: center;
          }
          .m-card {
            text-align: center;
          }
          .m-footer {
            flex-direction: column;
            gap: 6px;
            text-align: center;
          }
        }
      `}</style>

      <div className="m-container">
        <div className="m-glow-1" />
        <div className="m-glow-2" />

        {/* Main Content Area */}
        <div className="m-content">
          {/* Left Column: Brand & Hero */}
          <div className="m-left">
            {/* Logo */}
            <div style={{ marginBottom: 'clamp(16px, 2.5vh, 28px)' }}>
              <div
                style={{
                  fontSize: 'clamp(38px, 5vw, 68px)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-2px',
                  color: '#ffffff',
                }}
              >
                Results
                <span style={{ color: '#be121e' }}>.com</span>
              </div>
              <div
                style={{
                  fontSize: 'clamp(12px, 1.5vw, 16px)',
                  fontWeight: 500,
                  color: '#be121e',
                  letterSpacing: '1px',
                  marginTop: '-2px',
                  paddingLeft: '3px',
                }}
              >
                Disaster Management Platform
              </div>
            </div>

            {/* Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: 'clamp(14px, 2vh, 22px)',
                backgroundColor: 'rgba(190, 18, 30, 0.08)',
                border: '1px solid rgba(190, 18, 30, 0.25)',
                padding: '5px 14px',
                borderRadius: '30px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#be121e',
                  boxShadow: '0 0 8px #be121e',
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  color: '#be121e',
                  textTransform: 'uppercase',
                }}
              >
                Under Construction
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(24px, 3.5vw, 44px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: '0 0 clamp(10px, 1.5vh, 16px)',
                letterSpacing: '-0.5px',
                maxWidth: '500px',
              }}
            >
              Our website is on its way.
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                color: '#999999',
                lineHeight: 1.6,
                margin: '0 0 clamp(18px, 2.5vh, 28px)',
                maxWidth: '440px',
              }}
            >
              We&apos;re building something great for you. In the meantime, reach out to our team directly and we&apos;ll be happy to help.
            </p>

            {/* Primary Action Button */}
            <a href="mailto:info@results.com" className="m-email-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              info@results.com
            </a>
          </div>

          {/* Right Column: Direct Contacts Panel */}
          <div className="m-right">
            <div style={{ marginBottom: '2px', paddingLeft: '4px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#666666',
                  textTransform: 'uppercase',
                }}
              >
                Direct Contacts
              </span>
            </div>

            {/* Contact Card 1 */}
            <div className="m-card">
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  color: '#888888',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Herb Tremble
              </div>
              <a href="tel:+13478746296" className="m-phone-link">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.92-1.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +1 347 874 6296
              </a>
            </div>

            {/* Contact Card 2 */}
            <div className="m-card">
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  color: '#888888',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                KT Catlin
              </div>
              <a href="tel:+19082299150" className="m-phone-link">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.92-1.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +1 908 229 9150
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="m-footer">
          <div>© 2026 Results.com. All rights reserved.</div>
          <div style={{ color: '#444' }}>Under Maintenance Mode</div>
        </footer>
      </div>
    </>
  )
}
