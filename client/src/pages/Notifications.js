import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  .notif-root {
    min-height: calc(100vh - 64px);
    background: linear-gradient(160deg, #fdf6f5 0%, #fde8e8 100%);
    font-family: 'Outfit', sans-serif;
    padding: 48px 24px 80px;
  }

  .notif-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .notif-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .notif-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #1a0808;
    line-height: 1;
  }

  .notif-mark-all {
    padding: 8px 16px;
    background: rgba(201,40,45,0.08);
    border: 1px solid rgba(201,40,45,0.2);
    border-radius: 8px;
    color: #c9282d;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .notif-mark-all:hover {
    background: rgba(201,40,45,0.15);
  }

  .notif-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .notif-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    border: 1.5px solid #f0dada;
    box-shadow: 0 4px 16px rgba(201,40,45,0.04);
    display: flex;
    gap: 16px;
    transition: transform 0.2s;
    cursor: pointer;
  }

  .notif-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(201,40,45,0.08);
  }

  .notif-card.unread {
    background: #fffafa;
    border-left: 4px solid #c9282d;
  }

  .notif-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  .icon-info { background: #E0F2FE; color: #0369A1; }
  .icon-success { background: #D1FAE5; color: #059669; }
  .icon-warning { background: #FEF3C7; color: #D97706; }
  .icon-alert { background: #FEE2E2; color: #DC2626; }

  .notif-content {
    flex: 1;
  }

  .notif-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .notif-subject {
    font-weight: 600;
    color: #1a0808;
    font-size: 1rem;
  }

  .notif-time {
    font-size: 0.75rem;
    color: #9a6060;
  }

  .notif-msg {
    font-size: 0.9rem;
    color: #6b4040;
    line-height: 1.5;
  }

  .notif-empty {
    text-align: center;
    padding: 60px;
    color: #9a6060;
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return { emoji: '✅', cls: 'icon-success' };
    case 'warning': return { emoji: '⚠️', cls: 'icon-warning' };
    case 'alert': return { emoji: '🚨', cls: 'icon-alert' };
    default: return { emoji: 'ℹ️', cls: 'icon-info' };
  }
};

const timeAgo = (date) => {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (err) {
      toast.error("Failed to mark all as read.");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <style>{styles}</style>
      <div className="notif-root">
        <div className="notif-container">
          
          <div className="notif-header">
            <h1 className="notif-title">Notifications {unreadCount > 0 && <span style={{color: '#c9282d', fontSize: '1.2rem'}}>({unreadCount})</span>}</h1>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : notifications.length === 0 ? (
            <div className="notif-empty">You don't have any notifications yet.</div>
          ) : (
            <div className="notif-list">
              {notifications.map(n => {
                const { emoji, cls } = getIcon(n.type);
                return (
                  <div 
                    key={n._id} 
                    className={`notif-card ${!n.isRead ? 'unread' : ''}`}
                    onClick={() => handleMarkAsRead(n._id, n.isRead)}
                  >
                    <div className={`notif-icon-wrap ${cls}`}>{emoji}</div>
                    <div className="notif-content">
                      <div className="notif-top">
                        <div className="notif-subject">{n.title}</div>
                        <div className="notif-time">{timeAgo(n.createdAt)}</div>
                      </div>
                      <div className="notif-msg">{n.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
