import { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "../../components/Toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .bb-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    padding: 40px 52px;
  }
  .bb-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a0808;
    margin-bottom: 24px;
  }
  .bb-alert {
    padding: 16px;
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.3);
    border-radius: 12px;
    color: #b45309;
    margin-bottom: 24px;
    font-weight: 500;
  }
  .bb-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .bb-card {
    background: #fff;
    border: 1.5px solid #f0dada;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 16px rgba(201,40,45,0.05);
  }
  .bb-bg {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: #c9282d;
    margin-bottom: 4px;
  }
  .bb-units {
    font-size: 0.9rem;
    color: #9a6060;
    font-weight: 600;
  }
`;

export default function BankDashboard() {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/inventory")
      .then(res => setBank(res.data.bank))
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  if (!bank) return <div className="bb-root"><div className="bb-alert">Blood Bank not found.</div></div>;

  return (
    <>
      <style>{styles}</style>
      <div className="bb-root">
        <h1 className="bb-title">{bank.bankName} Dashboard</h1>
        
        {bank.approvalStatus !== 'approved' && (
          <div className="bb-alert">
            Your blood bank is currently <strong>{bank.approvalStatus}</strong>. You cannot accept donations or requests until approved by an admin.
          </div>
        )}

        <h2 style={{fontSize: '1.2rem', color: '#1a0808', marginBottom: '16px'}}>Current Stock (Units)</h2>
        <div className="bb-grid">
          {Object.entries(bank.availableBlood || {}).map(([bg, units]) => (
            <div key={bg} className="bb-card">
              <div className="bb-bg">{bg}</div>
              <div className="bb-units">{units} units</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
