const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ────────────────────────────────────────────────────────────────────────────
// verifyJWT — Extracts & verifies Bearer token, attaches req.user
// ────────────────────────────────────────────────────────────────────────────
const verifyJWT = async (req, res, next) => {
  try {
    // Extract token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, msg: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "lifelink_super_secret_jwt_key_2024_secure"
    );

    // Fetch fresh user from DB (catches blocked / deleted users)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "User no longer exists." });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        msg: "Your account has been blocked. Contact admin.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, msg: "Session expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ success: false, msg: "Invalid token. Please log in." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// authorizeRoles — Factory that returns middleware restricting to given roles
// Usage: router.get("/admin", verifyJWT, authorizeRoles("admin"), handler)
// ────────────────────────────────────────────────────────────────────────────
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, msg: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        msg: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

// ────────────────────────────────────────────────────────────────────────────
// Role shorthand middleware (combines verifyJWT + authorizeRoles)
// ────────────────────────────────────────────────────────────────────────────
const isAdmin      = [verifyJWT, authorizeRoles("admin")];
const isBloodBank  = [verifyJWT, authorizeRoles("bloodbank", "admin")];
const isDonor      = [verifyJWT, authorizeRoles("donor", "admin")];
const isRecipient  = [verifyJWT, authorizeRoles("recipient", "admin")];
const isAuthenticated = [verifyJWT]; // Any logged-in user

module.exports = {
  verifyJWT,
  authorizeRoles,
  isAdmin,
  isBloodBank,
  isDonor,
  isRecipient,
  isAuthenticated,
};