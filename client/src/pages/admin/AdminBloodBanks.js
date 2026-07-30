import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const styles = `
  /* Reuse styles from AdminUsers for consistency */
  .abb-root { min-height: calc(100vh - 64px); background: #0a0404; color: #fff; padding: 40px 52px; font-family: 'Outfit', sans-serif; }
  .abb-table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; }
  .abb-table th, .abb-table td { padding: 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .abb-table th { color: rgba(255,255,255,0.5); font-size: 0.8rem; text-transform: uppercase; }
  .abb-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
  .badge-pending { background: rgba(245,158,11,0.2); color: #F59E0B; }
  .badge-approved { background: rgba(16,185,129,0.2); color: #10B981; }
  .badge-rejected { background: rgba(239,68,68,0.2); color: #EF4444; }
  .abb-btn { padding: 6px 12px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-right: 8px; }
  .abb-btn:hover { background: rgba(255,255,255,0.1); }
`;

export default function AdminBloodBanks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBanks(); }, []);

  const loadBanks = () => {
    api.get("/admin/bloodbanks")
      .then(res => setBanks(res.data.banks))
      .catch(() => toast.error("Failed to load blood banks"))
      .finally(() => setLoading(false));
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/admin/bloodbanks/${id}/${action}`);
      toast.success(`Blood bank ${action}d`);
      loadBanks();
    } catch (err) {
      toast.error(`Failed to ${action} blood bank`);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <style>{styles}</style>
      <div className="abb-root">
        <h1 style={{fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', marginBottom: '24px'}}>Manage Blood Banks</h1>
        <table className="abb-table">
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>City</th>
              <th>License / Reg</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banks.map(b => (
              <tr key={b._id}>
                <td style={{fontWeight: 600}}>{b.bankName}</td>
                <td style={{color: 'rgba(255,255,255,0.6)'}}>{b.city}</td>
                <td style={{color: 'rgba(255,255,255,0.6)'}}>{b.licenseNumber} <br/><small>{b.registrationNumber}</small></td>
                <td><span className={`abb-badge badge-${b.approvalStatus}`}>{b.approvalStatus}</span></td>
                <td>
                  {b.approvalStatus === 'pending' && (
                    <>
                      <button className="abb-btn" style={{borderColor: '#10B981', color: '#10B981'}} onClick={() => handleAction(b._id, 'approve')}>Approve</button>
                      <button className="abb-btn" style={{borderColor: '#EF4444', color: '#EF4444'}} onClick={() => handleAction(b._id, 'reject')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
