const router = require("express").Router();
const {
  getDonations,
  createDonation,
  getRecentDonations,
  getMyDonations,
  deleteDonation,
} = require("../controllers/donationController");
const { verifyJWT, isAdmin, isDonor } = require("../middleware/authMiddleware");

// ── Public routes (backward compatible) ──────────────────────────────────────
router.get("/",       getDonations);
router.get("/recent", getRecentDonations);

// ── Authenticated: create donation (attach user if logged in, allow public too) 
// We use optional auth — try verifyJWT but don't block if missing
router.post("/", (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    // Try to authenticate, but continue even if it fails
    verifyJWT(req, res, (err) => {
      if (err) req.user = null; // Clear user if token invalid
      next();
    });
  } else {
    req.user = null;
    next();
  }
}, createDonation);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get("/mine",  ...isDonor,  getMyDonations);    // Donor's own donations
router.delete("/:id",...isAdmin,  deleteDonation);    // Admin delete

module.exports = router;