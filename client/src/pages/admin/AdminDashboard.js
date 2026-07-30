import { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "../../components/Toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .admin-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    padding: 48px 52px;
  }

  .admin-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 700;
    margin-bottom: 32px;
  }

  .admin-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .admin-stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .admin-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #e84044;
    line-height: 1;
    margin-bottom: 8px;
  }

  .admin-stat-label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => setStats(res.data.stats))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <h1 className="admin-title">Admin Dashboard</h1>

        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-val">{stats.totalUsers}</div>
              <div className="admin-stat-label">Total Users</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-val">{stats.totalBloodBanks}</div>
              <div className="admin-stat-label">Blood Banks</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-val">{stats.totalDonations}</div>
              <div className="admin-stat-label">Donations</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-val">{stats.totalRequests}</div>
              <div className="admin-stat-label">Requests</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-val" style={{color: '#F59E0B'}}>{stats.pendingBanks}</div>
              <div className="admin-stat-label">Pending Banks</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-val" style={{color: '#10B981'}}>{stats.recentUsers}</div>
              <div className="admin-stat-label">New Users (7d)</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
