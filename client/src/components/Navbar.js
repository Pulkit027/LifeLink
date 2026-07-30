import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .ll-nav {
    position: sticky;
    top: 0;
    z-index: 200;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 52px;
    background: rgba(10, 4, 4, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(201, 40, 45, 0.2);
    font-family: 'Outfit', sans-serif;
  }

  .ll-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .ll-logo-mark {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #c9282d, #ff4d54);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(201,40,45,0.45);
    animation: heartbeat 2s ease-in-out infinite;
  }

  .ll-logo-mark svg {
    width: 18px;
    height: 18px;
    fill: #fff;
  }

  @keyframes heartbeat {
    0%,100% { transform: scale(1); }
    15%      { transform: scale(1.12); }
    30%      { transform: scale(1); }
    45%      { transform: scale(1.07); }
  }

  .ll-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.3px;
  }

  .ll-logo-text span {
    color: #e84044;
  }

  .ll-links {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .ll-link {
    padding: 7px 15px;
    border-radius: 8px;
    color: rgba(255,255,255,0.58);
    font-size: 0.84rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .ll-link:hover {
    color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.07);
  }

  .ll-link.active {
    color: #fff;
    background: rgba(201,40,45,0.28);
    font-weight: 600;
  }

  .ll-cta {
    padding: 8px 20px;
    background: #c9282d;
    color: #fff !important;
    border-radius: 8px;
    font-weight: 600 !important;
    font-size: 0.84rem !important;
    box-shadow: 0 3px 12px rgba(201,40,45,0.4);
    transition: transform 0.18s, box-shadow 0.18s !important;
    margin-left: 6px;
  }

  .ll-cta:hover {
    background: #c9282d !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201,40,45,0.55) !important;
    color: #fff !important;
  }
`;

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, isLoggedIn, isAdmin, isBloodBank, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{navStyle}</style>
      <nav className="ll-nav">
        <Link to="/" className="ll-logo">
          <div className="ll-logo-mark">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span className="ll-logo-text">Life<span>Link</span></span>
        </Link>

        <div className="ll-links">
          {!loading && (
            <>
              {/* Common Links */}
              <Link to="/" className={`ll-link${pathname === "/" ? " active" : ""}`}>Home</Link>
              <Link to="/donations" className={`ll-link${pathname === "/donations" ? " active" : ""}`}>Donations</Link>
              <Link to="/requests" className={`ll-link${pathname === "/requests" ? " active" : ""}`}>Requests</Link>
              
              {/* Role Based Navigation */}
              {isLoggedIn ? (
                <>
                  <Link to={isAdmin ? "/admin" : isBloodBank ? "/bank" : "/dashboard"} className={`ll-link${["/admin", "/bank", "/dashboard"].includes(pathname) ? " active" : ""}`}>
                    Dashboard
                  </Link>
                  <Link to="/notifications" className={`ll-link${pathname === "/notifications" ? " active" : ""}`}>
                    Notifications
                  </Link>
                  <Link to="/profile" className={`ll-link${pathname === "/profile" ? " active" : ""}`}>
                    Profile
                  </Link>
                  
                  {(!isAdmin && !isBloodBank) && (
                    <>
                      <Link to="/donate" className={`ll-link ll-cta${pathname === "/donate" ? " active" : ""}`}>
                        Donate
                      </Link>
                      <Link to="/request" className={`ll-link${pathname === "/request" ? " active" : ""}`} style={{ marginLeft: 4 }}>
                        Request
                      </Link>
                    </>
                  )}
                  
                  <button onClick={handleLogout} className="ll-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 4 }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`ll-link${pathname === "/login" ? " active" : ""}`}>
                    Sign In
                  </Link>
                  <Link to="/register" className={`ll-link ll-cta${pathname === "/register" ? " active" : ""}`}>
                    Join Now
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
}
