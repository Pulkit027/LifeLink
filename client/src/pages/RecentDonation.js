import { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .rd-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    padding: 52px 52px 80px;
  }

  .rd-header {
    margin-bottom: 36px;
  }

  .rd-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #c9282d;
    margin-bottom: 10px;
  }

  .rd-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .rd-header p {
    color: #9a6060;
    font-size: 0.91rem;
  }

  /* ── TOOLBAR ─────────────────────────────────────── */
  .rd-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    align-items: center;
  }

  .rd-search-wrap {
    position: relative;
  }

  .rd-search-input {
    padding: 10px 16px 10px 38px;
    background: #fff;
    border: 1.5px solid #f0dada;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.86rem;
    color: #1a0808;
    outline: none;
    width: 240px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .rd-search-input:focus {
    border-color: #c9282d;
    box-shadow: 0 0 0 3px rgba(201,40,45,0.1);
  }

  .rd-search-input::placeholder {
    color: #c4a0a0;
  }

  .rd-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.82rem;
    color: #c4a0a0;
    pointer-events: none;
  }

  .rd-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .rd-pill {
    padding: 7px 15px;
    border-radius: 8px;
    border: 1.5px solid #f0dada;
    background: #fff;
    color: #c9282d;
    font-family: 'Outfit', sans-serif;
    font-size: 0.79rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.3px;
  }

  .rd-pill:hover {
    border-color: #c9282d;
    background: rgba(201,40,45,0.06);
  }

  .rd-pill.active {
    background: #c9282d;
    border-color: #c9282d;
    color: #fff;
  }

  .rd-count {
    margin-left: auto;
    font-size: 0.8rem;
    color: #b08080;
    align-self: center;
  }

  /* ── TABLE ───────────────────────────────────────── */
  .rd-table-wrap {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #f0dada;
    box-shadow: 0 8px 32px rgba(201,40,45,0.07);
    overflow: hidden;
  }

  .rd-table {
    width: 100%;
    border-collapse: collapse;
  }

  .rd-table thead tr {
    background: rgba(201,40,45,0.05);
    border-bottom: 1.5px solid #f0dada;
  }

  .rd-table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 0.7rem;
    font-weight: 600;
    color: #b08080;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .rd-table tbody tr {
    border-bottom: 1px solid #fdf0f0;
    transition: background 0.15s;
  }

  .rd-table tbody tr:last-child {
    border-bottom: none;
  }

  .rd-table tbody tr:hover {
    background: rgba(201,40,45,0.03);
  }

  .rd-table td {
    padding: 15px 20px;
    font-size: 0.88rem;
    color: #1a0808;
    vertical-align: middle;
  }

  .rd-blood-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border-radius: 7px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #fff;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    min-width: 44px;
  }

  .bg-A  { background: linear-gradient(135deg,#D92B3A,#a51f23); }
  .bg-B  { background: linear-gradient(135deg,#2563EB,#1a4db3); }
  .bg-O  { background: linear-gradient(135deg,#059669,#03734f); }
  .bg-AB { background: linear-gradient(135deg,#7C3AED,#5b22c2); }

  .rd-name {
    font-weight: 600;
    color: #1a0808;
  }

  .rd-city {
    color: #9a6060;
    font-size: 0.84rem;
  }

  .rd-bank {
    color: #6b4040;
    font-size: 0.84rem;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rd-units {
    font-weight: 600;
    color: #c9282d;
  }

  .rd-time {
    font-size: 0.8rem;
    color: #b08080;
  }

  .rd-pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c9282d;
    display: inline-block;
    margin-right: 7px;
    animation: pulse 1.6s infinite;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(201,40,45,0.5); }
    70%  { box-shadow: 0 0 0 6px rgba(201,40,45,0); }
    100% { box-shadow: 0 0 0 0 rgba(201,40,45,0); }
  }

  .rd-empty {
    padding: 80px;
    text-align: center;
    color: #b08080;
  }

  .rd-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    color: #6b4040;
    margin-top: 12px;
    font-weight: 700;
  }

  @media (max-width: 700px) {
    .rd-root { padding: 28px 14px 60px; }
    .rd-table th:nth-child(4),
    .rd-table td:nth-child(4) { display: none; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEMO = [
  { name: "Arjun Sharma",  bloodGroup: "A+",  quantity: 2, city: "Delhi",     bloodBank: "AIIMS Blood Bank",    createdAt: new Date(Date.now() - 10 * 60000) },
  { name: "Priya Mehta",   bloodGroup: "O-",  quantity: 1, city: "Mumbai",    bloodBank: "Tata Memorial",       createdAt: new Date(Date.now() - 40 * 60000) },
  { name: "Rahul Singh",   bloodGroup: "B+",  quantity: 3, city: "Jaipur",    bloodBank: "SMS Hospital",        createdAt: new Date(Date.now() - 2 * 3600000) },
  { name: "Sneha Patel",   bloodGroup: "AB+", quantity: 2, city: "Ahmedabad", bloodBank: "Civil Hospital",      createdAt: new Date(Date.now() - 5 * 3600000) },
  { name: "Vikram Nair",   bloodGroup: "O+",  quantity: 1, city: "Bengaluru", bloodBank: "St. John's Hospital", createdAt: new Date(Date.now() - 86400000) },
  { name: "Anita Desai",   bloodGroup: "A-",  quantity: 2, city: "Chennai",   bloodBank: "Apollo Blood Bank",   createdAt: new Date(Date.now() - 2 * 86400000) },
  { name: "Mohammed Khan", bloodGroup: "B-",  quantity: 1, city: "Hyderabad", bloodBank: "Nizam's Blood Bank",  createdAt: new Date(Date.now() - 3 * 86400000) },
  { name: "Kavya Rao",     bloodGroup: "AB-", quantity: 2, city: "Pune",      bloodBank: "Ruby Hall Clinic",    createdAt: new Date(Date.now() - 4 * 86400000) },
  { name: "Deepak Verma",  bloodGroup: "B+",  quantity: 3, city: "Lucknow",   bloodBank: "King George's",       createdAt: new Date(Date.now() - 5 * 86400000) },
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

export default function RecentDonations() {
  const [data, setData] = useState(DEMO);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/donation/recent")
      .then(res => { if (res.data?.length) setData(res.data); })
      .catch(() => {});
  }, []);

  const filtered = data.filter(d =>
    (!activeGroup || d.bloodGroup === activeGroup) &&
    (!search || d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodBank?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rd-root">
        <div className="rd-header">
          <div className="rd-label">Live Feed</div>
          <h1>Recent Donations</h1>
          <p>All blood donations logged across partnered banks</p>
        </div>

        <div className="rd-toolbar">
          <div className="rd-search-wrap">
            <span className="rd-search-icon">&#128269;</span>
            <input
              className="rd-search-input"
              placeholder="Search donor, city, bank..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rd-pills">
            <div
              className={`rd-pill${activeGroup === "" ? " active" : ""}`}
              onClick={() => setActiveGroup("")}
            >
              All
            </div>
            {BLOOD_GROUPS.map(g => (
              <div
                key={g}
                className={`rd-pill${activeGroup === g ? " active" : ""}`}
                onClick={() => setActiveGroup(activeGroup === g ? "" : g)}
              >
                {g}
              </div>
            ))}
          </div>
          <span className="rd-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="rd-table-wrap">
          {filtered.length === 0 ? (
            <div className="rd-empty">
              <div style={{ fontSize: "2.2rem" }}>&#9678;</div>
              <div className="rd-empty-title">No donations match your filter</div>
            </div>
          ) : (
            <table className="rd-table">
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
                {filtered.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`rd-blood-badge ${getBadgeClass(d.bloodGroup)}`}>
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="rd-name">{d.name || "Anonymous"}</td>
                    <td className="rd-city">{d.city}</td>
                    <td className="rd-bank">{d.bloodBank}</td>
                    <td className="rd-units">{d.quantity} u</td>
                    <td className="rd-time">
                      {i === 0 && <span className="rd-pulse-dot" />}
                      {timeAgo(d.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
