import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";
import api from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .prof-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    padding: 40px 24px 80px;
  }

  .prof-container {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 32px;
  }

  @media (max-width: 800px) {
    .prof-container { grid-template-columns: 1fr; }
  }

  .prof-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    border: 1.5px solid #f0dada;
    box-shadow: 0 10px 40px rgba(201,40,45,0.05);
  }

  /* ── SIDEBAR ───────────────────────────────────── */
  .prof-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .prof-avatar-wrap {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin-bottom: 20px;
    position: relative;
    border: 4px solid #fff;
    box-shadow: 0 8px 24px rgba(201,40,45,0.15);
    background: #fdf0f0;
    overflow: hidden;
  }

  .prof-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .prof-avatar-placeholder {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.5rem;
    color: #c9282d;
    font-weight: 700;
  }

  .prof-avatar-upload {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.6);
    color: #fff;
    font-size: 0.75rem;
    padding: 6px 0;
    cursor: pointer;
    transform: translateY(100%);
    transition: transform 0.2s;
  }

  .prof-avatar-wrap:hover .prof-avatar-upload {
    transform: translateY(0);
  }

  .prof-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1.1;
    margin-bottom: 4px;
  }

  .prof-role {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(201,40,45,0.1);
    color: #c9282d;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
  }

  .prof-stats {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-top: 1px solid #f0dada;
    padding-top: 24px;
  }

  .prof-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #6b4040;
  }

  .prof-stat strong {
    color: #1a0808;
    font-weight: 600;
  }

  /* ── MAIN CONTENT ──────────────────────────────── */
  .prof-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a0808;
    margin-bottom: 24px;
    border-bottom: 2px solid #f0dada;
    padding-bottom: 12px;
  }

  .prof-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  @media (max-width: 500px) {
    .prof-grid { grid-template-columns: 1fr; }
  }

  .prof-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .prof-field.full {
    grid-column: 1 / -1;
  }

  .prof-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #9a6060;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .prof-input {
    width: 100%;
    padding: 12px 14px;
    background: #fff8f6;
    border: 1.5px solid #f0dada;
    border-radius: 8px;
    color: #1a0808;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .prof-input:focus {
    border-color: #c9282d;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(201,40,45,0.1);
  }

  .prof-btn {
    padding: 12px 24px;
    background: #c9282d;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(201,40,45,0.3);
    transition: all 0.2s;
  }

  .prof-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(201,40,45,0.45);
  }

  .prof-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bloodGroup: user?.bloodGroup || "",
    city: user?.city || "",
    address: user?.address || "",
    age: user?.age || "",
  });

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/profile", formData);
      if (res.data.success) {
        updateUser(res.data.user);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setPassLoading(true);
    try {
      const res = await api.put("/profile/password", passData);
      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password.");
    } finally {
      setPassLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("photo", file);

    try {
      const res = await api.post("/profile/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        updateUser({ profilePhoto: res.data.photoUrl });
        toast.success("Profile photo updated!");
      }
    } catch (err) {
      toast.error("Failed to upload photo.");
    }
  };

  if (!user) return null;

  const photoUrl = user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : null;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <style>{styles}</style>
      <div className="prof-root">
        <div className="prof-container">
          
          {/* SIDEBAR */}
          <div className="prof-card prof-side">
            <div className="prof-avatar-wrap">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="prof-avatar" />
              ) : (
                <div className="prof-avatar-placeholder">{initial}</div>
              )}
              <label className="prof-avatar-upload">
                Upload Photo
                <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
              </label>
            </div>
            
            <div className="prof-name">{user.name}</div>
            <div className="prof-role">{user.role}</div>

            <div className="prof-stats">
              <div className="prof-stat">Email <strong>{user.email}</strong></div>
              <div className="prof-stat">Points <strong>{user.rewardPoints || 0}</strong></div>
              <div className="prof-stat">Joined <strong>{new Date(user.createdAt).toLocaleDateString()}</strong></div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div>
            <div className="prof-card" style={{ marginBottom: 32 }}>
              <h2 className="prof-section-title">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="prof-grid">
                  <div className="prof-field">
                    <label className="prof-label">Full Name</label>
                    <input className="prof-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Phone Number</label>
                    <input className="prof-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">City</label>
                    <input className="prof-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Age</label>
                    <input className="prof-input" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="prof-field full">
                    <label className="prof-label">Full Address</label>
                    <input className="prof-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="prof-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="prof-card">
              <h2 className="prof-section-title">Change Password</h2>
              <form onSubmit={handlePasswordUpdate}>
                <div className="prof-grid">
                  <div className="prof-field full">
                    <label className="prof-label">Current Password</label>
                    <input type="password" required className="prof-input" value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">New Password</label>
                    <input type="password" required minLength={6} className="prof-input" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Confirm New Password</label>
                    <input type="password" required minLength={6} className="prof-input" value={passData.confirmPassword} onChange={e => setPassData({...passData, confirmPassword: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="prof-btn" disabled={passLoading}>
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
