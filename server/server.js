require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ── Connect Database ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files (Profile Photos) ───────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ───────────────────────────────────────────────────────────────────
// Public auth routes
app.use("/api/auth",         require("./routes/authRoutes"));

// Existing feature routes (preserved exactly)
app.use("/api/request",      require("./routes/requestRoutes"));
app.use("/api/donation",     require("./routes/donationRoutes"));

// New feature routes
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api/profile",      require("./routes/profileRoutes"));
app.use("/api/admin",        require("./routes/adminRoutes"));
app.use("/api/inventory",    require("./routes/inventoryRoutes"));
app.use("/api/notifications",require("./routes/notificationRoutes"));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));