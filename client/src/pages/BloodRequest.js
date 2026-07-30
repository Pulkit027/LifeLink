import { useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .req-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    font-family: 'Outfit', sans-serif;
    padding: 60px 24px 80px;
    position: relative;
    overflow: hidden;
  }

  .req-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(201,40,45,0.15) 0%, transparent 65%),
      radial-gradient(ellipse 50% 50% at 80% 70%, rgba(201,40,45,0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  .req-inner {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
  }

  /* ── HEADER ─────────────────────────────────────── */
  .req-header {
    margin-bottom: 52px;
  }

  .req-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #e84044;
    margin-bottom: 12px;
  }

  .req-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 10px;
  }

  .req-header h1 em {
    font-style: italic;
    color: #e84044;
  }

  .req-header p {
    color: rgba(255,255,255,0.4);
    font-size: 0.93rem;
    max-width: 440px;
    line-height: 1.7;
  }

  /* ── TWO-COL LAYOUT ─────────────────────────────── */
  .req-layout {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 40px;
    align-items: flex-start;
  }

  /* ── FORM ───────────────────────────────────────── */
  .req-form-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
  }

  .req-form-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b0000, #c9282d, #ff6b6b);
  }

  .req-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.55rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 28px;
  }

  .req-field {
    margin-bottom: 18px;
  }

  .req-fl-label {
    display: block;
    font-size: 0.71rem;
    font-weight: 600;
    color: rgba(255,255,255,0.38);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .req-input, .req-select {
    width: 100%;
    padding: 12px 15px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.91rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .req-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .req-input:focus, .req-select:focus {
    border-color: rgba(201,40,45,0.6);
    background: rgba(201,40,45,0.07);
    box-shadow: 0 0 0 3px rgba(201,40,45,0.12);
  }

  .req-select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .req-select option {
    background: #1a0808;
  }

  .req-btn {
    width: 100%;
    padding: 14px;
    background: #c9282d;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    box-shadow: 0 4px 18px rgba(201,40,45,0.4);
    transition: transform 0.18s, box-shadow 0.18s;
    letter-spacing: 0.3px;
  }

  .req-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,40,45,0.55);
  }

  .req-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  /* ── RESULTS PANEL ───────────────────────────────── */
  .req-results-panel {
    min-height: 200px;
  }

  .req-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .req-results-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
  }

  .req-filter-pills {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }

  .req-pill {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    background: transparent;
    color: rgba(255,255,255,0.5);
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .req-pill:hover {
    border-color: rgba(201,40,45,0.5);
    color: rgba(255,255,255,0.8);
  }

  .req-pill.active {
    background: #c9282d;
    border-color: #c9282d;
    color: #fff;
    font-weight: 600;
  }

  .req-count {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.3);
  }

  .req-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }

  .req-result-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 22px 20px;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .req-result-card:hover {
    border-color: rgba(201,40,45,0.35);
    background: rgba(255,255,255,0.07);
    transform: translateY(-3px);
  }

  .req-result-top {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .req-result-badge {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #8b0000, #c9282d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(201,40,45,0.35);
  }

  .req-result-bank {
    font-size: 0.92rem;
    font-weight: 600;
    color: rgba(255,255,255,0.88);
    line-height: 1.3;
  }

  .req-result-city {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.38);
    margin-top: 2px;
  }

  .req-result-units {
    font-size: 0.83rem;
    color: #e84044;
    font-weight: 600;
    padding: 6px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .req-map-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px;
    background: rgba(201,40,45,0.15);
    border: 1px solid rgba(201,40,45,0.3);
    border-radius: 8px;
    color: #f87275;
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.18s;
  }

  .req-map-link:hover {
    background: rgba(201,40,45,0.28);
  }

  .req-empty {
    padding: 60px 0;
    text-align: center;
    color: rgba(255,255,255,0.25);
  }

  .req-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .req-empty-text {
    font-size: 0.9rem;
  }

  .req-success {
    padding: 11px 14px;
    background: rgba(5,150,105,0.12);
    border: 1px solid rgba(5,150,105,0.3);
    border-radius: 8px;
    color: #34d399;
    font-size: 0.84rem;
    margin-bottom: 18px;
  }

  @media (max-width: 900px) {
    .req-layout { grid-template-columns: 1fr; }
    .req-header h1 { font-size: 2.2rem; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function BloodRequest() {
  const [data, setData] = useState({});
  const [results, setResults] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!data.name || !data.bloodGroup || !data.quantity || !data.city) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/request", data);
      const res = await axios.post("http://localhost:5000/api/request/find-blood", {
        bloodGroup: data.bloodGroup,
      });
      setResults(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  const cities = [...new Set(results.map(r => r._id.city))];
  const filteredResults = filterCity
    ? results.filter(r => r._id.city === filterCity)
    : results;

  return (
    <>
      <style>{styles}</style>
      <div className="req-root">
        <div className="req-inner">
          <div className="req-header">
            <div className="req-label">Emergency Request</div>
            <h1>Request <em>Blood</em></h1>
            <p>
              Submit your blood request and instantly see available units at
              banks near you. We match by blood group in real time.
            </p>
          </div>

          <div className="req-layout">
            {/* FORM */}
            <div className="req-form-card">
              <div className="req-form-title">New Request</div>

              {submitted && (
                <div className="req-success">
                  Request submitted. Showing available blood banks below.
                </div>
              )}

              <div className="req-field">
                <label className="req-fl-label">Your Full Name</label>
                <input
                  className="req-input"
                  placeholder="e.g. Ravi Kumar"
                  onChange={e => setData({ ...data, name: e.target.value })}
                />
              </div>

              <div className="req-field">
                <label className="req-fl-label">Blood Group Required</label>
                <select
                  className="req-select"
                  defaultValue=""
                  onChange={e => setData({ ...data, bloodGroup: e.target.value })}
                >
                  <option value="" disabled>Select blood group</option>
                  {BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="req-field">
                <label className="req-fl-label">Units Required</label>
                <input
                  className="req-input"
                  type="number"
                  placeholder="e.g. 2"
                  min="1"
                  onChange={e => setData({ ...data, quantity: e.target.value })}
                />
              </div>

              <div className="req-field">
                <label className="req-fl-label">Your City</label>
                <input
                  className="req-input"
                  placeholder="e.g. Jaipur"
                  onChange={e => setData({ ...data, city: e.target.value })}
                />
              </div>

              <button className="req-btn" onClick={submit} disabled={loading}>
                {loading ? "Searching..." : "Submit & Find Blood Banks"}
              </button>
            </div>

            {/* RESULTS */}
            <div className="req-results-panel">
              {results.length > 0 ? (
                <>
                  <div className="req-results-header">
                    <div>
                      <div className="req-results-title">Available Banks</div>
                      <div className="req-count">{filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found</div>
                    </div>
                    <div className="req-filter-pills">
                      <div
                        className={`req-pill${filterCity === "" ? " active" : ""}`}
                        onClick={() => setFilterCity("")}
                      >
                        All
                      </div>
                      {cities.map(c => (
                        <div
                          key={c}
                          className={`req-pill${filterCity === c ? " active" : ""}`}
                          onClick={() => setFilterCity(filterCity === c ? "" : c)}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="req-results-grid">
                    {filteredResults.map((d, i) => (
                      <div className="req-result-card" key={i}>
                        <div className="req-result-top">
                          <div className="req-result-badge">{d._id?.bloodGroup || data.bloodGroup}</div>
                          <div>
                            <div className="req-result-bank">{d._id?.bloodBank}</div>
                            <div className="req-result-city">{d._id?.city}</div>
                          </div>
                        </div>
                        <div className="req-result-units">
                          {d.totalUnits} unit{d.totalUnits !== 1 ? "s" : ""} available
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(
                            (d._id?.bloodBank || "") + " " + (d._id?.city || "")
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="req-map-link"
                        >
                          View on Map
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="req-empty">
                  <div className="req-empty-icon">◈</div>
                  <div className="req-empty-text">
                    Submit a request to see available blood banks
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
