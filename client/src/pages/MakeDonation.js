import { useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .don-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 60px 24px 80px;
    position: relative;
    overflow: hidden;
  }

  .don-root::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,40,45,0.1) 0%, transparent 70%);
    top: -200px; right: -100px;
    pointer-events: none;
  }

  .don-root::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,40,45,0.07) 0%, transparent 70%);
    bottom: -100px; left: -100px;
    pointer-events: none;
  }

  .don-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 52px;
    max-width: 1000px;
    width: 100%;
    position: relative;
  }

  /* ── LEFT INFO PANEL ─────────────────────────────── */
  .don-info {
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .don-info-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #c9282d;
  }

  .don-info h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1.1;
  }

  .don-info h1 em {
    font-style: italic;
    color: #c9282d;
  }

  .don-info-body {
    color: #6b4040;
    font-size: 0.95rem;
    line-height: 1.8;
    max-width: 380px;
  }

  .don-fact-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 8px;
  }

  .don-fact {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .don-fact-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c9282d;
    flex-shrink: 0;
  }

  .don-fact-text {
    font-size: 0.87rem;
    color: #6b4040;
  }

  .don-impact {
    margin-top: 8px;
    padding: 24px;
    background: rgba(201,40,45,0.08);
    border: 1px solid rgba(201,40,45,0.2);
    border-radius: 16px;
  }

  .don-impact-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #c9282d;
    line-height: 1;
    margin-bottom: 4px;
  }

  .don-impact-label {
    font-size: 0.83rem;
    color: #8a4040;
  }

  /* ── FORM CARD ───────────────────────────────────── */
  .don-card {
    background: #fff;
    border-radius: 24px;
    padding: 44px 40px;
    box-shadow: 0 20px 60px rgba(201,40,45,0.12);
    border: 1.5px solid rgba(201,40,45,0.12);
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: none; }
  }

  .don-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b0000, #c9282d, #ff6b6b);
  }

  .don-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px;
    background: rgba(201,40,45,0.08);
    border: 1px solid rgba(201,40,45,0.2);
    border-radius: 999px;
    font-size: 0.71rem;
    font-weight: 600;
    color: #c9282d;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .don-card-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c9282d;
  }

  .don-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a0808;
    margin-bottom: 6px;
  }

  .don-card-subtitle {
    font-size: 0.86rem;
    color: #9a6060;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .don-field {
    margin-bottom: 18px;
  }

  .don-label {
    display: block;
    font-size: 0.71rem;
    font-weight: 600;
    color: #9a6060;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .don-input {
    width: 100%;
    padding: 12px 15px;
    background: #fff8f6;
    border: 1.5px solid #f0dada;
    border-radius: 10px;
    color: #1a0808;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .don-input::placeholder {
    color: #c4a0a0;
  }

  .don-input:focus {
    border-color: #c9282d;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(201,40,45,0.1);
  }

  .don-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .don-select {
    width: 100%;
    padding: 12px 15px;
    background: #fff8f6;
    border: 1.5px solid #f0dada;
    border-radius: 10px;
    color: #1a0808;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9282d' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    box-sizing: border-box;
  }

  .don-select:focus {
    border-color: #c9282d;
    box-shadow: 0 0 0 3px rgba(201,40,45,0.1);
  }

  .don-btn {
    width: 100%;
    padding: 15px;
    background: #c9282d;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    box-shadow: 0 4px 18px rgba(201,40,45,0.38);
    transition: transform 0.18s, box-shadow 0.18s;
    letter-spacing: 0.3px;
  }

  .don-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,40,45,0.52);
  }

  .don-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .don-note {
    text-align: center;
    font-size: 0.78rem;
    color: #b08080;
    margin-top: 14px;
    line-height: 1.5;
  }

  .don-success {
    padding: 14px 16px;
    background: rgba(5,150,105,0.1);
    border: 1px solid rgba(5,150,105,0.3);
    border-radius: 10px;
    color: #065f46;
    font-size: 0.87rem;
    margin-bottom: 20px;
    font-weight: 500;
  }

  @media (max-width: 860px) {
    .don-layout { grid-template-columns: 1fr; }
    .don-info { display: none; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function MakeDonation() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!data.name || !data.bloodGroup || !data.quantity || !data.city || !data.bloodBank) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/donation", data, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "donation_certificate.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="don-root">
        <div className="don-layout">

          {/* LEFT INFO */}
          <div className="don-info">
            <div className="don-info-label">Make a Difference</div>
            <h1>Donate<br />Blood,<br /><em>Save Lives.</em></h1>
            <p className="don-info-body">
              A single blood donation takes less than 10 minutes and can save up to
              3 lives. Your generosity directly impacts patients in hospitals across India.
            </p>

            <div className="don-fact-list">
              <div className="don-fact">
                <div className="don-fact-dot" />
                <span className="don-fact-text">1 in 3 people will need blood in their lifetime</span>
              </div>
              <div className="don-fact">
                <div className="don-fact-dot" />
                <span className="don-fact-text">Blood cannot be manufactured — only donated</span>
              </div>
              <div className="don-fact">
                <div className="don-fact-dot" />
                <span className="don-fact-text">Your certificate is issued instantly after donation</span>
              </div>
              <div className="don-fact">
                <div className="don-fact-dot" />
                <span className="don-fact-text">O- donors are universal — always in high demand</span>
              </div>
            </div>

            <div className="don-impact">
              <div className="don-impact-num">3x</div>
              <div className="don-impact-label">Lives your single donation can save</div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="don-card">
            <div className="don-card-badge">
              <div className="don-card-badge-dot" />
              Donation Form
            </div>
            <div className="don-card-title">Donate Blood</div>
            <div className="don-card-subtitle">
              Fill in the details below. A certificate will be downloaded upon submission.
            </div>

            {success && (
              <div className="don-success">
                Donation recorded! Your certificate has been downloaded.
              </div>
            )}

            <div className="don-field">
              <label className="don-label">Full Name</label>
              <input
                className="don-input"
                placeholder="Your full name"
                onChange={e => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div className="don-row">
              <div className="don-field">
                <label className="don-label">Blood Group</label>
                <select
                  className="don-select"
                  defaultValue=""
                  onChange={e => setData({ ...data, bloodGroup: e.target.value })}
                >
                  <option value="" disabled>Select</option>
                  {BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="don-field">
                <label className="don-label">Quantity (Units)</label>
                <input
                  className="don-input"
                  type="number"
                  placeholder="e.g. 2"
                  min="1"
                  onChange={e => setData({ ...data, quantity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="don-field">
              <label className="don-label">City</label>
              <input
                className="don-input"
                placeholder="Your city"
                onChange={e => setData({ ...data, city: e.target.value })}
              />
            </div>

            <div className="don-field">
              <label className="don-label">Blood Bank Name</label>
              <input
                className="don-input"
                placeholder="e.g. AIIMS Blood Bank"
                onChange={e => setData({ ...data, bloodBank: e.target.value })}
              />
            </div>

            <button className="don-btn" onClick={submit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Donation & Download Certificate"}
            </button>

            <div className="don-note">
              Your data is encrypted and only used for donation tracking.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
