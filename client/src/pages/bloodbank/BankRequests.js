import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const styles = `
  /* Reusing base styles */
  .br-root { min-height: calc(100vh - 64px); background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%); padding: 40px 52px; font-family: 'Outfit', sans-serif; }
  .br-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: #1a0808; margin-bottom: 24px; }
  .br-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(201,40,45,0.05); }
  .br-table th, .br-table td { padding: 16px; text-align: left; border-bottom: 1px solid #f0dada; }
  .br-table th { color: #9a6060; font-size: 0.8rem; text-transform: uppercase; background: rgba(201,40,45,0.02); }
  .br-btn { padding: 8px 16px; background: #c9282d; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; margin-right: 8px; }
  .br-btn-outline { background: transparent; border: 1px solid #c9282d; color: #c9282d; }
`;

export default function BankRequests() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    api.get("/inventory/donations")
      .then(res => setDonations(res.data.donations))
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  const handleDonationAction = async (id, status) => {
    try {
      await api.patch(`/inventory/donations/${id}`, { status });
      toast.success(`Donation ${status}`);
      loadData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <style>{styles}</style>
      <div className="br-root">
        <h1 className="br-title">Pending Donations</h1>
        {donations.length === 0 ? <p style={{color: '#9a6060'}}>No pending donations.</p> : (
          <table className="br-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d._id}>
                  <td>{d.name || d.donorId?.name}</td>
                  <td style={{fontWeight: 700, color: '#c9282d'}}>{d.bloodGroup}</td>
                  <td>{d.quantity}</td>
                  <td>
                    <button className="br-btn" onClick={() => handleDonationAction(d._id, 'approved')}>Accept & Add to Stock</button>
                    <button className="br-btn br-btn-outline" onClick={() => handleDonationAction(d._id, 'rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
