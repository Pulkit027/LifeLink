import { useAuth } from "../context/AuthContext";

// ────────────────────────────────────────────────────────────────────────────
// RoleGuard Component
// Usage:
// <RoleGuard roles={["admin", "bloodbank"]}>
//   <button>Manage Inventory</button>
// </RoleGuard>
// ────────────────────────────────────────────────────────────────────────────
export default function RoleGuard({ children, roles = [] }) {
  const { user, loading } = useAuth();

  // Don't render while loading or if not logged in
  if (loading || !user) {
    return null;
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
}
