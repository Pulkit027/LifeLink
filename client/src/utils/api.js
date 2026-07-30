import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: Attach JWT Token ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (we use "ll_token" as the key)
    const token = localStorage.getItem("ll_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle Global Auth Errors ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to an invalid/expired token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("ll_token");
      
      // We don't want to force redirect if they are just checking auth status on mount
      // So we only redirect if it's not the /auth/me endpoint
      if (error.config.url !== "/auth/me") {
        window.location.href = "/login?expired=true";
      }
    }
    
    // Optional: Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      console.warn("Access denied: 403 Forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
