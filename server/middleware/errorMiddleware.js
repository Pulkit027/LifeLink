// ────────────────────────────────────────────────────────────────────────────
// Global Express error handler — must have 4 parameters (err, req, res, next)
// ────────────────────────────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, msg: messages.join(", ") });
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      msg: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, msg: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, msg: "Token expired." });
  }

  // Cast error (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, msg: "Invalid ID format." });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
