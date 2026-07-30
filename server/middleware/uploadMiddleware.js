const multer = require("multer");
const path = require("path");

// ── Storage Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Unique filename: userId-timestamp.ext
    const userId = req.user ? req.user._id : "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${userId}-${Date.now()}${ext}`);
  },
});

// ── File Filter (only images) ─────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

// ── Upload Middleware ─────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
