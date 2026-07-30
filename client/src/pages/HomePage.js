import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  .hp-root {
    font-family: 'Outfit', sans-serif;
    background: #0a0404;
    color: #fff;
    overflow-x: hidden;
  }

  /* ── HERO ───────────────────────────────────────── */
  .hp-hero {
    min-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
  }

  .hp-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,40,45,0.22) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(180,20,20,0.14) 0%, transparent 70%),
      radial-gradient(ellipse 30% 30% at 10% 60%, rgba(201,40,45,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .hp-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 0.5;
    pointer-events: none;
  }

  .hp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(201,40,45,0.12);
    border: 1px solid rgba(201,40,45,0.35);
    color: #f87275;
    border-radius: 999px;
    padding: 6px 18px;
    font-size: 0.73rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 30px;
    animation: fadeUp 0.6s 0.1s both;
  }

  .hp-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c9282d;
    animation: pulse 1.6s infinite;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(201,40,45,0.6); }
    70%  { box-shadow: 0 0 0 6px rgba(201,40,45,0); }
    100% { box-shadow: 0 0 0 0 rgba(201,40,45,0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: none; }
  }

  .hp-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.2rem, 8vw, 6.2rem);
    font-weight: 700;
    line-height: 1.0;
    color: #fff;
    margin-bottom: 24px;
    animation: fadeUp 0.6s 0.2s both;
    letter-spacing: -1px;
  }

  .hp-h1 em {
    color: #e84044;
    font-style: italic;
  }

  .hp-h1 .hp-h1-line2 {
    display: block;
    color: rgba(255,255,255,0.38);
    font-style: italic;
    font-size: 0.72em;
  }

  .hp-desc {
    max-width: 480px;
    color: rgba(255,255,255,0.52);
    font-size: 1.05rem;
    line-height: 1.8;
    margin-bottom: 44px;
    animation: fadeUp 0.6s 0.3s both;
  }

  .hp-actions {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeUp 0.6s 0.4s both;
  }

  .hp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 34px;
    background: #c9282d;
    color: #fff;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 22px rgba(201,40,45,0.5);
    transition: transform 0.18s, box-shadow 0.18s;
    letter-spacing: 0.2px;
  }

  .hp-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 36px rgba(201,40,45,0.62);
  }

  .hp-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 34px;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.82);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.18);
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, transform 0.18s;
  }

  .hp-btn-ghost:hover {
    background: rgba(255,255,255,0.11);
    border-color: rgba(255,255,255,0.38);
    transform: translateY(-3px);
  }

  /* ── STATS ───────────────────────────────────────── */
  .hp-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    margin-top: 72px;
    padding: 0 24px;
    flex-wrap: wrap;
    animation: fadeUp 0.6s 0.5s both;
  }

  .hp-stat {
    padding: 0 40px;
    text-align: center;
  }

  .hp-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #e84044;
    line-height: 1;
  }

  .hp-stat-label {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.38);
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-top: 6px;
    font-weight: 500;
  }

  .hp-stat-divider {
    width: 1px;
    height: 44px;
    background: rgba(255,255,255,0.1);
  }

  /* ── ABOUT SECTION ───────────────────────────────── */
  .hp-about {
    padding: 100px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hp-about-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #e84044;
    margin-bottom: 18px;
  }

  .hp-about-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 22px;
  }

  .hp-about-body {
    color: rgba(255,255,255,0.52);
    font-size: 0.97rem;
    line-height: 1.85;
    margin-bottom: 18px;
  }

  .hp-about-features {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 32px;
  }

  .hp-feature-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .hp-feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(201,40,45,0.15);
    border: 1px solid rgba(201,40,45,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
  }

  .hp-feature-text strong {
    display: block;
    font-size: 0.88rem;
    font-weight: 600;
    color: rgba(255,255,255,0.88);
    margin-bottom: 2px;
  }

  .hp-feature-text span {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.42);
  }

  /* ── RIGHT PANEL ─────────────────────────────────── */
  .hp-right-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .hp-panel-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px 20px;
    transition: border-color 0.2s, background 0.2s;
  }

  .hp-panel-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(201,40,45,0.3);
  }

  .hp-panel-card:first-child {
    grid-column: 1 / -1;
    background: rgba(201,40,45,0.1);
    border-color: rgba(201,40,45,0.25);
  }

  .hp-panel-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: #e84044;
    line-height: 1;
    margin-bottom: 6px;
  }

  .hp-panel-label {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.5);
    font-weight: 400;
  }

  .hp-panel-sub {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.28);
    margin-top: 4px;
  }

  /* ── BLOOD TYPES ─────────────────────────────────── */
  .hp-blood-section {
    padding: 80px 80px;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .hp-section-header {
    text-align: center;
    margin-bottom: 52px;
  }

  .hp-section-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #e84044;
    margin-bottom: 14px;
  }

  .hp-section-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #fff;
  }

  .hp-blood-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 12px;
    max-width: 900px;
    margin: 0 auto;
  }

  .hp-blood-type {
    aspect-ratio: 1;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    transition: all 0.2s;
    cursor: default;
    gap: 4px;
  }

  .hp-blood-type:hover {
    background: rgba(201,40,45,0.18);
    border-color: rgba(201,40,45,0.45);
    transform: translateY(-4px);
  }

  .hp-blood-type-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #e84044;
  }

  .hp-blood-type-label {
    font-size: 0.6rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* ── HOW IT WORKS ────────────────────────────────── */
  .hp-how {
    padding: 100px 80px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .hp-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 52px;
  }

  .hp-step {
    position: relative;
    padding: 28px 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    transition: border-color 0.2s;
  }

  .hp-step:hover {
    border-color: rgba(201,40,45,0.35);
  }

  .hp-step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: rgba(201,40,45,0.18);
    line-height: 1;
    margin-bottom: 16px;
  }

  .hp-step-title {
    font-weight: 600;
    font-size: 0.97rem;
    color: rgba(255,255,255,0.88);
    margin-bottom: 8px;
  }

  .hp-step-body {
    font-size: 0.84rem;
    color: rgba(255,255,255,0.42);
    line-height: 1.7;
  }

  /* ── FOOTER ─────────────────────────────────────── */
  .hp-footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 32px 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .hp-footer-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
  }

  .hp-footer-brand span {
    color: #e84044;
  }

  .hp-footer-copy {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.25);
  }

  @media (max-width: 900px) {
    .hp-about { grid-template-columns: 1fr; padding: 60px 24px; gap: 40px; }
    .hp-blood-section { padding: 60px 24px; }
    .hp-blood-grid { grid-template-columns: repeat(4, 1fr); }
    .hp-how { padding: 60px 24px; }
    .hp-steps { grid-template-columns: 1fr; }
    .hp-footer { padding: 24px; flex-direction: column; text-align: center; }
  }
`;

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const features = [
  { icon: "◈", title: "Instant Matching", desc: "Provides AI-powered blood bank details to recipients" },
  { icon: "◈", title: "Certificate on Donation", desc: "Verified PDF certificate issued for every donation" },
  { icon: "◈", title: "Real-time Tracking", desc: "Track request fulfillment live as it happens" },
];

const steps = [
  { num: "01", title: "Get Started with LifeLink", body: "Interact and Explore the platform to learn how you can make a difference." },
  { num: "02", title: "Donate or Request", body: "Walk into any partnered blood bank, donate, and we handle the paperwork instantly." },
  { num: "03", title: "Track Impact", body: "See exactly how your donation is being used and who it saves." },
];

export default function HomePage() {
  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">

        {/* ── HERO ── */}
        <section className="hp-hero">
          <div className="hp-hero-bg" />
          <div className="hp-noise" />

          <div className="hp-eyebrow">
            <div className="hp-eyebrow-dot" />
            Blood Donation Platform — India
          </div>

          <h1 className="hp-h1">
            Every Drop <em>Matters.</em>
            <span className="hp-h1-line2">Be the reason someone lives.</span>
          </h1>

          <p className="hp-desc">
            LifeLink connects blood donors with patients in need across India.
            Fast, verified, and life-saving — your donation reaches the right person at the right time.
          </p>

          <div className="hp-actions">
            <Link to="/donate" className="hp-btn-primary">
              Donate Blood
            </Link>
            <Link to="/request" className="hp-btn-ghost">
              Request Blood
            </Link>
          </div>

          <div className="hp-stats">
            <div className="hp-stat">
              <div className="hp-stat-num">10K+</div>
              <div className="hp-stat-label">Active Donors</div>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <div className="hp-stat-num">50K+</div>
              <div className="hp-stat-label">Lives Saved</div>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <div className="hp-stat-num">200+</div>
              <div className="hp-stat-label">Blood Banks</div>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <div className="hp-stat-num">8</div>
              <div className="hp-stat-label">Blood Types</div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="hp-about">
          <div>
            <div className="hp-about-label">About LifeLink</div>
            <h2 className="hp-about-h2">
              India's Most Trusted<br />Blood Network
            </h2>
            <p className="hp-about-body">
              LifeLink was built with one mission: eliminate the gap between blood donors
              and patients. Our platform connects blood banks, recipients, and donors in
              real time — ensuring no one waits too long for the blood they need.
            </p>
            <p className="hp-about-body">
              Whether you're a first-time donor or a seasoned lifesaver,
              LifeLink gives you the tools to act fast and save lives.
            </p>

            <div className="hp-about-features">
              {features.map((f, i) => (
                <div className="hp-feature-row" key={i}>
                  <div className="hp-feature-icon">{f.icon}</div>
                  <div className="hp-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hp-right-panel">
            <div className="hp-panel-card">
              <div className="hp-panel-num">98.4%</div>
              <div className="hp-panel-label">Request fulfilment rate</div>
              <div className="hp-panel-sub">Across all partnered banks</div>
            </div>
            <div className="hp-panel-card">
              <div className="hp-panel-num">4.2h</div>
              <div className="hp-panel-label">Avg. response time</div>
            </div>
            <div className="hp-panel-card">
              <div className="hp-panel-num">24/7</div>
              <div className="hp-panel-label">Platform availability</div>
            </div>
           
          </div>
        </section>

        {/* ── BLOOD TYPES ── */}
        <section className="hp-blood-section">
          <div className="hp-section-header">
            <div className="hp-section-label">Supported Types</div>
            <h2 className="hp-section-h2">All 8 Blood Groups Covered</h2>
          </div>
          <div className="hp-blood-grid">
            {bloodTypes.map(bt => (
              <div className="hp-blood-type" key={bt}>
                <div className="hp-blood-type-name">{bt}</div>
                <div className="hp-blood-type-label">Type</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="hp-how">
          <div className="hp-section-header">
            <div className="hp-section-label">Process</div>
            <h2 className="hp-section-h2">How LifeLink Works</h2>
          </div>
          <div className="hp-steps">
            {steps.map(s => (
              <div className="hp-step" key={s.num}>
                <div className="hp-step-num">{s.num}</div>
                <div className="hp-step-title">{s.title}</div>
                <div className="hp-step-body">{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="hp-footer">
          <div className="hp-footer-brand">Life<span>Link</span></div>
          <div className="hp-footer-copy">
            Built to save lives across India. Every unit counts.
          </div>
        </footer>

      </div>
    </>
  );
}
