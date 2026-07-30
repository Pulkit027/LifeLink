import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const styles = `
  /* Reusing bb styles */
  .inv-root { min-height: calc(100vh - 64px); background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%); padding: 40px 52px; font-family: 'Outfit', sans-serif; }
  .inv-card { background: #fff; border: 1.5px solid #f0dada; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(201,40,45,0.05); margin-bottom: 24px; max-width: 500px; }
  .inv-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: #1a0808; margin-bottom: 24px; }
  .inv-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .inv-label { font-size: 0.8rem; font-weight: 600; color: #9a6060; text-transform: uppercase; }
  .inv-select, .inv-input { width: 100%; padding: 12px; background: #fff8f6; border: 1.5px solid #f0dada; border-radius: 8px; font-family: 'Outfit', sans-serif; outline: none; }
  .inv-select:focus, .inv-input:focus { border-color: #c9282d; }
  .inv-btn { padding: 12px 24px; background: #c9282d; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; }
  .inv-btn:hover { background: #b42024; }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Inventory() {
  const [formData, setFormData] = useState({ bloodGroup: "A+", units: 1, operation: "add" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/inventory", formData);
      toast.success("Stock updated successfully");
      setFormData(prev => ({ ...prev, units: 1 }));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="inv-root">
        <h1 className="inv-title">Manage Inventory</h1>
        <div className="inv-card">
          <form onSubmit={handleSubmit}>
            <div className="inv-field">
              <label className="inv-label">Blood Group</label>
              <select className="inv-select" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="inv-field">
              <label className="inv-label">Operation</label>
              <select className="inv-select" value={formData.operation} onChange={e => setFormData({...formData, operation: e.target.value})}>
                <option value="add">Add Stock (+)</option>
                <option value="subtract">Remove Stock (-)</option>
              </select>
            </div>
            <div className="inv-field">
              <label className="inv-label">Units</label>
              <input type="number" min="1" className="inv-input" value={formData.units} onChange={e => setFormData({...formData, units: Number(e.target.value)})} />
            </div>
            <button type="submit" className="inv-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Stock"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
