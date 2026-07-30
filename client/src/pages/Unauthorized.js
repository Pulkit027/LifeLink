import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .unauth-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .unauth-bg {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,40,45,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .unauth-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    max-width: 480px;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  .unauth-icon {
    font-size: 4rem;
    margin-bottom: 24px;
  }

  .unauth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .unauth-body {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .unauth-btn {
    display: inline-block;
    padding: 14px 32px;
    background: #c9282d;
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 4px 18px rgba(201,40,45,0.38);
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .unauth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,40,45,0.52);
  }
`;

export default function Unauthorized() {
  return (
    <>
      <style>{styles}</style>
      <div className="unauth-root">
        <div className="unauth-bg" />
        <div className="unauth-card">
          <div className="unauth-icon">🛑</div>
          <h1 className="unauth-title">Access Denied</h1>
          <p className="unauth-body">
            You don't have the necessary permissions to view this page. If you believe this is a mistake, please contact support or log in with a different account.
          </p>
          <Link to="/" className="unauth-btn">
            Return Home
          </Link>
        </div>
      </div>
    </>
  );
}
