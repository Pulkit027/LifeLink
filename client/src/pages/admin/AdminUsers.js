import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const styles = `
  .au-root {
    min-height: calc(100vh - 64px);
    background: #0a0404;
    color: #fff;
    padding: 40px 52px;
    font-family: 'Outfit', sans-serif;
  }
  .au-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    overflow: hidden;
  }
  .au-table th, .au-table td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .au-table th {
    color: rgba(255,255,255,0.5);
    font-size: 0.8rem;
    text-transform: uppercase;
  }
  .au-role {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    background: rgba(201,40,45,0.2);
    color: #ff6b6b;
  }
  .au-btn {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-right: 8px;
  }
  .au-btn:hover { background: rgba(255,255,255,0.1); }
  .au-btn-danger { border-color: #c9282d; color: #ff6b6b; }
  .au-btn-danger:hover { background: rgba(201,40,45,0.1); }
`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api.get("/users")
      .then(res => setUsers(res.data.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await api.patch(`/users/${id}/block`);
      toast.success(isBlocked ? "User unblocked" : "User blocked");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to block user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete user");
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <style>{styles}</style>
      <div className="au-root">
        <h1 style={{fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', marginBottom: '24px'}}>Manage Users</h1>
        <table className="au-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td style={{color: 'rgba(255,255,255,0.6)'}}>{u.email}</td>
                <td><span className="au-role">{u.role}</span></td>
                <td>
                  <span style={{color: u.isBlocked ? '#EF4444' : '#10B981'}}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  <button className="au-btn" onClick={() => handleBlock(u._id, u.isBlocked)}>
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button className="au-btn au-btn-danger" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
