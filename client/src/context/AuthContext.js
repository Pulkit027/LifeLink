import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

// ── Create Context ────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Auth Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem("ll_token") || null);
  const [loading, setLoading] = useState(true); // true while checking stored token

  // ── Auto Login: Check token on mount ──────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("ll_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Validate token by fetching current user
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          setToken(storedToken);
        } else {
          // Invalid response — clear stale token
          localStorage.removeItem("ll_token");
          setToken(null);
        }
      })
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem("ll_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── login: store token + user in state + localStorage ─────────────────────
  const login = (newToken, userData) => {
    localStorage.setItem("ll_token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  // ── logout: clear everything ───────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("ll_token");
    setToken(null);
    setUser(null);
  };

  // ── updateUser: update user state after profile changes ───────────────────
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // ── Role Checks (convenience helpers) ─────────────────────────────────────
  const isAdmin      = user?.role === "admin";
  const isDonor      = user?.role === "donor";
  const isRecipient  = user?.role === "recipient";
  const isBloodBank  = user?.role === "bloodbank";
  const isLoggedIn   = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAdmin,
        isDonor,
        isRecipient,
        isBloodBank,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Custom Hook ───────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
