import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";
import api from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .auth-root {
    min-height: calc(100vh - 64px);
    display: flex;
    background: #0a0404;
    font-family: 'Outfit', sans-serif;
  }

  .auth-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 8%;
    position: relative;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,40,45,0.12) 0%, transparent 70%);
    top: -200px; left: -200px;
    pointer-events: none;
  }

  .auth-right {
    flex: 1;
    background: url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') center/cover no-repeat;
    position: relative;
    display: none;
  }
  @media (min-width: 900px) {
    .auth-right { display: block; }
  }

  .auth-right-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(10,4,4,0.9) 0%, rgba(201,40,45,0.4) 100%);
  }

  .auth-card {
    max-width: 440px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .auth-eyebrow {
    display: inline-block;
    color: #e84044;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .auth-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 0.95rem;
    margin-bottom: 40px;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .auth-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
  }

  .auth-input {
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

  .auth-input:focus {
    background: rgba(255,255,255,0.08);
    border-color: rgba(201,40,45,0.5);
    box-shadow: 0 0 0 3px rgba(201,40,45,0.15);
  }

  .auth-btn {
    width: 100%;
    padding: 15px;
    background: #c9282d;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    box-shadow: 0 4px 18px rgba(201,40,45,0.38);
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .auth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,40,45,0.52);
  }

  .auth-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .auth-footer {
    margin-top: 32px;
    text-align: center;
    font-size: 0.88rem;
    color: rgba(255,255,255,0.5);
  }

  .auth-link {
    color: #e84044;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .auth-link:hover {
    color: #ff6b6b;
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success("Welcome back!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="auth-card">
            <span className="auth-eyebrow">Welcome Back</span>
            <h1 className="auth-title">Sign in to LifeLink</h1>
            <p className="auth-subtitle">Access your dashboard to manage donations and requests.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-right-overlay" />
        </div>
      </div>
    </>
  );
}
