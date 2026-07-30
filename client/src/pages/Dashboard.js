import { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .dash-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    padding: 48px 52px 80px;
  }

  /* ── PAGE HEADER ─────────────────────────────────── */
  .dash-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .dash-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #c9282d;
    margin-bottom: 8px;
  }

  .dash-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1.1;
  }

  .dash-page-sub {
    color: #9a6060;
    font-size: 0.89rem;
    margin-top: 4px;
  }

  .dash-refresh {
    padding: 9px 18px;
    background: rgba(201,40,45,0.08);
    border: 1.5px solid rgba(201,40,45,0.2);
    border-radius: 8px;
    color: #c9282d;
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    letter-spacing: 0.3px;
  }

  .dash-refresh:hover {
    background: rgba(201,40,45,0.15);
  }

  /* ── STAT CARDS ─────────────────────────────────── */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 44px;
  }

  .dash-stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px 22px;
    border: 1.5px solid #f0dada;
    box-shadow: 0 4px 16px rgba(201,40,45,0.07);
    position: relative;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .dash-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(201,40,45,0.13);
  }

  .dash-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b0000, #c9282d, #ff6b6b);
  }

  .dash-stat-label {
    font-size: 0.69rem;
    font-weight: 600;
    color: #b08080;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .dash-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1;
  }

  .dash-stat-sub {
    font-size: 0.75rem;
    color: #c9282d;
    margin-top: 6px;
    font-weight: 500;
  }

  /* ── SECTION ─────────────────────────────────────── */
  .dash-section {
    margin-bottom: 48px;
  }

  .dash-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .dash-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a0808;
  }

  .dash-section-count {
    font-size: 0.78rem;
    color: #b08080;
  }

  /* ── FILTERS ─────────────────────────────────────── */
  .dash-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
    align-items: center;
  }

  .dash-filter-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #b08080;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-right: 2px;
  }

  .dash-pill {
    padding: 6px 13px;
    border-radius: 7px;
    border: 1.5px solid #f0dada;
    background: #fff;
    color: #c9282d;
    font-family: 'Outfit', sans-serif;
    font-size: 0.77rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .dash-pill:hover {
    border-color: #c9282d;
    background: rgba(201,40,45,0.05);
  }

  .dash-pill.active {
    background: #c9282d;
    border-color: #c9282d;
    color: #fff;
  }

  .dash-city-select {
    padding: 7px 14px;
    background: #fff;
    border: 1.5px solid #f0dada;
    border-radius: 7px;
    color: #1a0808;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23c9282d' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }

  .dash-city-select:focus {
    border-color: #c9282d;
  }

  /* ── TABLE ───────────────────────────────────────── */
  .dash-table-wrap {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #f0dada;
    box-shadow: 0 4px 18px rgba(201,40,45,0.06);
    overflow: hidden;
  }

  .dash-table {
    width: 100%;
    border-collapse: collapse;
  }

  .dash-table thead tr {
    background: rgba(201,40,45,0.04);
    border-bottom: 1.5px solid #f0dada;
  }

  .dash-table th {
    padding: 13px 18px;
    text-align: left;
    font-size: 0.69rem;
    font-weight: 600;
    color: #b08080;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dash-table tbody tr {
    border-bottom: 1px solid #fdf0f0;
    transition: background 0.13s;
  }

  .dash-table tbody tr:last-child {
    border-bottom: none;
  }

  .dash-table tbody tr:hover {
    background: rgba(201,40,45,0.025);
  }

  .dash-table td {
    padding: 13px 18px;
    font-size: 0.87rem;
    color: #2a0808;
    vertical-align: middle;
  }

  .dash-blood-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 11px;
    border-radius: 6px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.93rem;
    font-weight: 700;
    color: #fff;
    min-width: 40px;
  }

  .bg-A  { background: linear-gradient(135deg,#D92B3A,#a51f23); }
  .bg-B  { background: linear-gradient(135deg,#2563EB,#1a4db3); }
  .bg-O  { background: linear-gradient(135deg,#059669,#03734f); }
  .bg-AB { background: linear-gradient(135deg,#7C3AED,#5b22c2); }

  .dash-td-name { font-weight: 600; color: #1a0808; }
  .dash-td-muted { color: #9a6060; font-size: 0.83rem; }
  .dash-td-units { font-weight: 600; color: #c9282d; }

  .dash-urgent-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.73rem;
    font-weight: 600;
    color: #c9282d;
    background: rgba(201,40,45,0.09);
    border: 1px solid rgba(201,40,45,0.22);
    padding: 3px 9px;
    border-radius: 5px;
  }

  .dash-urgent-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #c9282d;
    animation: pulse 1.6s infinite;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(201,40,45,0.5); }
    70%  { box-shadow: 0 0 0 5px rgba(201,40,45,0); }
    100% { box-shadow: 0 0 0 0 rgba(201,40,45,0); }
  }

  .dash-empty {
    padding: 60px;
    text-align: center;
    color: #b08080;
  }

  .dash-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    color: #9a6060;
    margin-top: 10px;
    font-weight: 700;
  }

  .dash-tab-bar {
    display: flex;
    gap: 0;
    margin-bottom: 0;
    border-bottom: 2px solid #f0dada;
  }

  .dash-tab {
    padding: 10px 24px;
    font-size: 0.86rem;
    font-weight: 600;
    color: #b08080;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: color 0.15s, border-color 0.15s;
  }

  .dash-tab.active {
    color: #c9282d;
    border-bottom-color: #c9282d;
  }

  .dash-tab:hover {
    color: #8b0000;
  }

  @media (max-width: 900px) {
    .dash-root { padding: 28px 14px 60px; }
    .dash-stats { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 560px) {
    .dash-stats { grid-template-columns: 1fr; }
    .dash-table th:nth-child(4),
    .dash-table td:nth-child(4) { display: none; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];



function getBadgeClass(g = "") {
  if (g.startsWith("AB")) return "bg-AB";
  if (g.startsWith("A"))  return "bg-A";
  if (g.startsWith("B"))  return "bg-B";
  return "bg-O";
}

function timeAgo(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  const s = (Date.now() - d) / 1000;
  if (s < 0)     return "Just now";
  if (s < 60)    return "Just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Dashboard() {
  const [requests, setRequests]   = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("donations");

  // Per-table filters
  const [dGroup, setDGroup] = useState("");
  const [dCity,  setDCity]  = useState("");
  const [rGroup, setRGroup] = useState("");
  const [rCity,  setRCity]  = useState("");

  const load = () => {
    axios.get("http://localhost:5000/api/request")
      .then(res => { if (res.data?.length) setRequests(res.data); })
      .catch(() => {});
    axios.get("http://localhost:5000/api/donation")
      .then(res => { if (res.data?.length) setDonations(res.data); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const donationCities = [...new Set(donations.map(d => d.city).filter(Boolean))];
  const requestCities  = [...new Set(requests.map(r => r.city).filter(Boolean))];

  const filteredDonations = donations.filter(d => {
    const dt = new Date(d.createdAt);
    return d.name && d.name.trim() !== "" &&
      d.createdAt && !isNaN(dt.getTime()) &&
      (!dGroup || d.bloodGroup === dGroup) &&
      (!dCity  || d.city === dCity);
  });

  const filteredRequests = requests.filter(r => {
    const dt = new Date(r.createdAt);
    return r.name && r.name.trim() !== "" &&
      r.createdAt && !isNaN(dt.getTime()) &&
      (!rGroup || r.bloodGroup === rGroup) &&
      (!rCity  || r.city === rCity);
  });

  const totalUnits = donations.reduce((s, d) => s + (d.quantity || 0), 0);
  const pendingReqs = requests.length;

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">

        {/* PAGE HEADER */}
        <div className="dash-page-header">
          <div>
            <div className="dash-label">Overview</div>
            <div className="dash-page-title">Dashboard</div>
            <div className="dash-page-sub">Live overview of all donations and blood requests</div>
          </div>
          <button className="dash-refresh" onClick={load}>Refresh Data</button>
        </div>

        {/* STAT CARDS */}
        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-label">Total Donations</div>
            <div className="dash-stat-value">{donations.length}</div>
            <div className="dash-stat-sub">All time</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-label">Units Collected</div>
            <div className="dash-stat-value">{totalUnits}</div>
            <div className="dash-stat-sub">Across all banks</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-label">Open Requests</div>
            <div className="dash-stat-value">{pendingReqs}</div>
            <div className="dash-stat-sub">Awaiting fulfillment</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-label">Cities Active</div>
            <div className="dash-stat-value">{donationCities.length}</div>
            <div className="dash-stat-sub">Coverage area</div>
          </div>
        </div>

        {/* TABS */}
        <div className="dash-tab-bar" style={{ marginBottom: 28 }}>
          <div
            className={`dash-tab${activeTab === "donations" ? " active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            Recent Donations
          </div>
          <div
            className={`dash-tab${activeTab === "requests" ? " active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Blood Requests
          </div>
        </div>

        {/* DONATIONS TABLE */}
        {activeTab === "donations" && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div>
                <div className="dash-section-title">Recent Donations</div>
              </div>
              <span className="dash-section-count">{filteredDonations.length} records</span>
            </div>

            {/* FILTERS */}
            <div className="dash-filters">
              <span className="dash-filter-label">Blood Group:</span>
              <div
                className={`dash-pill${dGroup === "" ? " active" : ""}`}
                onClick={() => setDGroup("")}
              >
                All
              </div>
              {BLOOD_GROUPS.map(g => (
                <div
                  key={g}
                  className={`dash-pill${dGroup === g ? " active" : ""}`}
                  onClick={() => setDGroup(dGroup === g ? "" : g)}
                >
                  {g}
                </div>
              ))}
              <span className="dash-filter-label" style={{ marginLeft: 8 }}>City:</span>
              <select
                className="dash-city-select"
                value={dCity}
                onChange={e => setDCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {donationCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="dash-table-wrap">
              {filteredDonations.length === 0 ? (
                <div className="dash-empty">
                  <div style={{ fontSize: "2rem" }}>&#9678;</div>
                  <div className="dash-empty-title">No donations match your filter</div>
                </div>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Blood Group</th>
                      <th>Donor Name</th>
                      <th>City</th>
                      <th>Blood Bank</th>
                      <th>Units</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((d, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`dash-blood-badge ${getBadgeClass(d.bloodGroup)}`}>
                            {d.bloodGroup}
                          </span>
                        </td>
                        <td className="dash-td-name">{d.name || "Anonymous"}</td>
                        <td className="dash-td-muted">{d.city}</td>
                        <td className="dash-td-muted">{d.bloodBank}</td>
                        <td className="dash-td-units">{d.quantity} u</td>
                        <td className="dash-td-muted">{timeAgo(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* REQUESTS TABLE */}
        {activeTab === "requests" && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div>
                <div className="dash-section-title">Blood Requests</div>
              </div>
              <span className="dash-section-count">{filteredRequests.length} records</span>
            </div>

            {/* FILTERS */}
            <div className="dash-filters">
              <span className="dash-filter-label">Blood Group:</span>
              <div
                className={`dash-pill${rGroup === "" ? " active" : ""}`}
                onClick={() => setRGroup("")}
              >
                All
              </div>
              {BLOOD_GROUPS.map(g => (
                <div
                  key={g}
                  className={`dash-pill${rGroup === g ? " active" : ""}`}
                  onClick={() => setRGroup(rGroup === g ? "" : g)}
                >
                  {g}
                </div>
              ))}
              <span className="dash-filter-label" style={{ marginLeft: 8 }}>City:</span>
              <select
                className="dash-city-select"
                value={rCity}
                onChange={e => setRCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {requestCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="dash-table-wrap">
              {filteredRequests.length === 0 ? (
                <div className="dash-empty">
                  <div style={{ fontSize: "2rem" }}>&#9678;</div>
                  <div className="dash-empty-title">No requests match your filter</div>
                </div>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Blood Group</th>
                      <th>Requester</th>
                      <th>City</th>
                      <th>Units Needed</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`dash-blood-badge ${getBadgeClass(r.bloodGroup)}`}>
                            {r.bloodGroup}
                          </span>
                        </td>
                        <td className="dash-td-name">{r.name || "Anonymous"}</td>
                        <td className="dash-td-muted">{r.city}</td>
                        <td className="dash-td-units">{r.quantity} unit{r.quantity > 1 ? "s" : ""}</td>
                        <td>
                          <span className="dash-urgent-tag">
                            <span className="dash-urgent-dot" />
                            Urgent
                          </span>
                        </td>
                        <td className="dash-td-muted">{timeAgo(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
