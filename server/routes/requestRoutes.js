const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRecentRequests,
  getMyRequests,
  updateRequestStatus,
  deleteRequest,
  findBloodBanks,
} = require("../controllers/requestController");
const { verifyJWT, isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

// ── Public routes (backward compatible) ──────────────────────────────────────
router.get("/",       getRequests);
router.get("/recent", getRecentRequests);
router.post("/find-blood", findBloodBanks);

// ── Optional auth on POST (attach user if logged in) ─────────────────────────
router.post("/", (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    verifyJWT(req, res, (err) => {
      if (err) req.user = null;
      next();
    });
  } else {
    req.user = null;
    next();
  }
}, createRequest);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get("/mine",         ...isAuthenticated, getMyRequests);       // Own requests
router.patch("/:id/status", ...isAuthenticated, updateRequestStatus); // Update status
router.delete("/:id",       ...isAdmin,         deleteRequest);       // Admin delete

module.exports = router;