import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";
import api from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .reg-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    font-family: 'Outfit', sans-serif;
    padding: 60px 24px;
    position: relative;
    overflow: hidden;
  }

  .reg-root::before {
    content: '';
    position: absolute;
    width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,40,45,0.08) 0%, transparent 70%);
    top: -200px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .reg-container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .reg-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .reg-eyebrow {
    display: inline-block;
    color: #e84044;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .reg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
  }

  .reg-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(10px);
  }

  .reg-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 600px) {
    .reg-grid { grid-template-columns: 1fr; }
  }

  .reg-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .reg-field.full {
    grid-column: 1 / -1;
  }

  .reg-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
  }

  .reg-input, .reg-select {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .reg-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-opacity='0.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }
  
  .reg-select option {
    background: #1a0808;
    color: #fff;
  }

  .reg-input:focus, .reg-select:focus {
    background: rgba(255,255,255,0.08);
    border-color: rgba(201,40,45,0.5);
    box-shadow: 0 0 0 3px rgba(201,40,45,0.15);
  }

  .reg-section-title {
    grid-column: 1 / -1;
    font-size: 0.85rem;
    font-weight: 600;
    color: #e84044;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 8px;
  }

  .reg-btn {
    grid-column: 1 / -1;
    padding: 16px;
    background: #c9282d;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    box-shadow: 0 4px 18px rgba(201,40,45,0.38);
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .reg-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,40,45,0.52);
  }

  .reg-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .reg-footer {
    margin-top: 32px;
    text-align: center;
    font-size: 0.88rem;
    color: rgba(255,255,255,0.5);
  }

  .reg-link {
    color: #e84044;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .reg-link:hover {
    color: #ff6b6b;
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "donor",
    bloodGroup: "",
    gender: "",
    age: "",
    city: "",
    address: "",
    // Blood Bank Fields
    bankName: "",
    licenseNumber: "",
    registrationNumber: "",
    operatingHours: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      if (res.data.success) {
        toast.success("Registration successful!");
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const isBloodBank = formData.role === "bloodbank";

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-container">
          
          <div className="reg-header">
            <span className="reg-eyebrow">Join the Network</span>
            <h1 className="reg-title">Create an Account</h1>
          </div>

          <div className="reg-card">
            <form className="reg-grid" onSubmit={handleSubmit}>
              
              <div className="reg-section-title">Account Details</div>
              
              <div className="reg-field">
                <label className="reg-label">Role</label>
                <select name="role" className="reg-select" value={formData.role} onChange={handleChange}>
                  <option value="donor">Individual Donor</option>
                  <option value="recipient">Patient / Recipient</option>
                  <option value="bloodbank">Blood Bank Organization</option>
                </select>
              </div>
              <div className="reg-field">
                <label className="reg-label">{isBloodBank ? "Contact Person Name" : "Full Name"}</label>
                <input name="name" type="text" className="reg-input" required value={formData.name} onChange={handleChange} />
              </div>

              <div className="reg-field">
                <label className="reg-label">Email Address</label>
                <input name="email" type="email" className="reg-input" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="reg-field">
                <label className="reg-label">Phone Number</label>
                <input name="phone" type="text" className="reg-input" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="reg-field">
                <label className="reg-label">Password</label>
                <input name="password" type="password" className="reg-input" required minLength={6} value={formData.password} onChange={handleChange} />
              </div>
              <div className="reg-field">
                <label className="reg-label">Confirm Password</label>
                <input name="confirmPassword" type="password" className="reg-input" required minLength={6} value={formData.confirmPassword} onChange={handleChange} />
              </div>

              {isBloodBank ? (
                <>
                  <div className="reg-section-title">Blood Bank Information</div>
                  <div className="reg-field">
                    <label className="reg-label">Blood Bank Name</label>
                    <input name="bankName" type="text" className="reg-input" required value={formData.bankName} onChange={handleChange} />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">License Number</label>
                    <input name="licenseNumber" type="text" className="reg-input" required value={formData.licenseNumber} onChange={handleChange} />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Registration Number</label>
                    <input name="registrationNumber" type="text" className="reg-input" required value={formData.registrationNumber} onChange={handleChange} />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Operating Hours</label>
                    <input name="operatingHours" type="text" className="reg-input" placeholder="e.g. 24/7 or 9AM-5PM" value={formData.operatingHours} onChange={handleChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="reg-section-title">Medical Information</div>
                  <div className="reg-field">
                    <label className="reg-label">Blood Group</label>
                    <select name="bloodGroup" className="reg-select" value={formData.bloodGroup} onChange={handleChange}>
                      <option value="">Select...</option>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Gender</label>
                    <select name="gender" className="reg-select" value={formData.gender} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Age</label>
                    <input name="age" type="number" className="reg-input" min="18" max="100" value={formData.age} onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="reg-section-title">Location</div>
              <div className="reg-field">
                <label className="reg-label">City</label>
                <input name="city" type="text" className="reg-input" required value={formData.city} onChange={handleChange} />
              </div>
              <div className="reg-field">
                <label className="reg-label">Full Address</label>
                <input name="address" type="text" className="reg-input" value={formData.address} onChange={handleChange} />
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>
          </div>

          <div className="reg-footer">
            Already have an account? <Link to="/login" className="reg-link">Sign In</Link>
          </div>

        </div>
      </div>
    </>
  );
}
