import { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .rl-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    font-family: 'Outfit', sans-serif;
    padding: 52px 52px 80px;
    position: relative;
    overflow: hidden;
  }

  .rl-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 40% at 10% 20%, rgba(201,40,45,0.14) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 90% 80%, rgba(201,40,45,0.09) 0%, transparent 65%);
    pointer-events: none;
  }

  .rl-inner {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
  }

  .rl-header {
    margin-bottom: 36px;
  }

  .rl-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #e84044;
    margin-bottom: 10px;
  }

  .rl-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
  }

  .rl-header p {
    color: rgba(255,255,255,0.38);
    font-size: 0.91rem;
  }

  /* ── TOOLBAR ─────────────────────────────────────── */
  .rl-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    align-items: center;
  }

  .rl-search-wrap {
    position: relative;
  }

  .rl-search-input {
    padding: 10px 16px 10px 38px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.86rem;
    color: #fff;
    outline: none;
    width: 240px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .rl-search-input:focus {
    border-color: rgba(201,40,45,0.55);
    box-shadow: 0 0 0 3px rgba(201,40,45,0.12);
  }

  .rl-search-input::placeholder {
    color: rgba(255,255,255,0.22);
  }

  .rl-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.82rem;
    color: rgba(255,255,255,0.3);
    pointer-events: none;
  }

  .rl-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .rl-pill {
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent;
    color: rgba(255,255,255,0.45);
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .rl-pill:hover {
    border-color: rgba(201,40,45,0.45);
    color: rgba(255,255,255,0.8);
  }

  .rl-pill.active {
    background: #c9282d;
    border-color: #c9282d;
    color: #fff;
  }

  .rl-count {
    margin-left: auto;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.25);
    align-self: center;
  }

  /* ── TABLE ───────────────────────────────────────── */
  .rl-table-wrap {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    overflow: hidden;
  }

  .rl-table {
    width: 100%;
    border-collapse: collapse;
  }

  .rl-table thead tr {
    background: rgba(201,40,45,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .rl-table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 0.69rem;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .rl-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.15s;
  }

  .rl-table tbody tr:last-child {
    border-bottom: none;
  }

  .rl-table tbody tr:hover {
    background: rgba(255,255,255,0.03);
  }

  .rl-table td {
    padding: 15px 20px;
    font-size: 0.88rem;
    color: rgba(255,255,255,0.78);
    vertical-align: middle;
  }

  .rl-blood-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border-radius: 7px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.97rem;
    font-weight: 700;
    color: #fff;
    min-width: 44px;
  }

  .bg-A  { background: linear-gradient(135deg,#D92B3A,#a51f23); }
  .bg-B  { background: linear-gradient(135deg,#2563EB,#1a4db3); }
  .bg-O  { background: linear-gradient(135deg,#059669,#03734f); }
  .bg-AB { background: linear-gradient(135deg,#7C3AED,#5b22c2); }

  .rl-units {
    font-weight: 600;
    color: #e84044;
  }

  .rl-city {
    color: rgba(255,255,255,0.45);
    font-size: 0.84rem;
  }

  .rl-urgent {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    font-weight: 600;
    color: #f87275;
    padding: 4px 10px;
    background: rgba(201,40,45,0.15);
    border: 1px solid rgba(201,40,45,0.3);
    border-radius: 6px;
  }

  .rl-urgent-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #e84044;
    animation: pulse 1.6s infinite;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(201,40,45,0.5); }
    70%  { box-shadow: 0 0 0 5px rgba(201,40,45,0); }
    100% { box-shadow: 0 0 0 0 rgba(201,40,45,0); }
  }

  .rl-time {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.3);
  }

  .rl-empty {
    padding: 80px;
    text-align: center;
    color: rgba(255,255,255,0.25);
  }

  .rl-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    color: rgba(255,255,255,0.35);
    margin-top: 12px;
    font-weight: 700;
  }

  @media (max-width: 700px) {
    .rl-root { padding: 28px 14px 60px; }
    .rl-table th:nth-child(4),
    .rl-table td:nth-child(4) { display: none; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEMO = [
  { bloodGroup: "O-",  quantity: 2, city: "Delhi",     name: "Ravi Kumar",    createdAt: new Date(Date.now() - 5 * 60000) },
  { bloodGroup: "A+",  quantity: 1, city: "Mumbai",    name: "Sunita Sharma", createdAt: new Date(Date.now() - 22 * 60000) },
  { bloodGroup: "B+",  quantity: 3, city: "Jaipur",    name: "Amit Gupta",    createdAt: new Date(Date.now() - 1.5 * 3600000) },
  { bloodGroup: "AB-", quantity: 1, city: "Hyderabad", name: "Preethi R.",    createdAt: new Date(Date.now() - 4 * 3600000) },
  { bloodGroup: "O+",  quantity: 2, city: "Bengaluru", name: "Naveen Rao",    createdAt: new Date(Date.now() - 86400000) },
];

function getBadgeClass(g = "") {
  if (g.startsWith("AB")) return "bg-AB";
  if (g.startsWith("A"))  return "bg-A";
  if (g.startsWith("B"))  return "bg-B";
  return "bg-O";
}

function timeAgo(date) {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60)    return "Just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function RequestList() {
  const [data, setData] = useState(DEMO);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/request/recent")
      .then(res => { if (res.data?.length) setData(res.data); })
      .catch(() => {});
  }, []);

  const filtered = data.filter(d =>
    (!activeGroup || d.bloodGroup === activeGroup) &&
    (!search ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rl-root">
        <div className="rl-inner">
          <div className="rl-header">
            <div className="rl-label">Live Requests</div>
            <h1>Blood Requests</h1>
            <p>Urgent requests from patients awaiting blood</p>
          </div>

          <div className="rl-toolbar">
            <div className="rl-search-wrap">
              <span className="rl-search-icon">&#128269;</span>
              <input
                className="rl-search-input"
                placeholder="Search by name or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="rl-pills">
              <div
                className={`rl-pill${activeGroup === "" ? " active" : ""}`}
                onClick={() => setActiveGroup("")}
              >
                All
              </div>
              {BLOOD_GROUPS.map(g => (
                <div
                  key={g}
                  className={`rl-pill${activeGroup === g ? " active" : ""}`}
                  onClick={() => setActiveGroup(activeGroup === g ? "" : g)}
                >
                  {g}
                </div>
              ))}
            </div>
            <span className="rl-count">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="rl-table-wrap">
            {filtered.length === 0 ? (
              <div className="rl-empty">
                <div style={{ fontSize: "2.2rem" }}>&#9678;</div>
                <div className="rl-empty-title">No requests match your filter</div>
              </div>
            ) : (
              <table className="rl-table">
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Patient / Requester</th>
                    <th>City</th>
                    <th>Units Needed</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`rl-blood-badge ${getBadgeClass(r.bloodGroup)}`}>
                          {r.bloodGroup}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "linear-gradient(135deg,rgba(201,40,45,0.3),rgba(201,40,45,0.1))",
                            border: "1.5px solid rgba(201,40,45,0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 700, fontSize: "0.88rem", color: "#f87275",
                            flexShrink: 0
                          }}>
                            {(r.name || "A")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                            {r.name || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="rl-city">{r.city}</td>
                      <td className="rl-units">{r.quantity} unit{r.quantity > 1 ? "s" : ""}</td>
                      <td>
                        <span className="rl-urgent">
                          <span className="rl-urgent-dot" />
                          Urgent
                        </span>
                      </td>
                      <td className="rl-time">{timeAgo(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
