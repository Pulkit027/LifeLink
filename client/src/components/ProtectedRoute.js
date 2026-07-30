import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// ────────────────────────────────────────────────────────────────────────────
// ProtectedRoute Wrapper
// Usage: 
// <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
// ────────────────────────────────────────────────────────────────────────────
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still checking auth status on initial load, show spinner
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // If not logged in, redirect to login page (saving the attempted URL)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles array is provided and user's role is not in it, redirect to unauthorized
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If logged in and role is authorized (or no roles specified), render children
  return children;
}
