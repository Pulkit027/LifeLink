const router = require("express").Router();
const {
  getDashboardStats,
  getAllBloodBanks,
  approveBloodBank,
  rejectBloodBank,
  deleteBloodBank,
  getAnalytics,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/authMiddleware");

// All routes are admin-only
router.get("/dashboard",              ...isAdmin, getDashboardStats);
router.get("/bloodbanks",             ...isAdmin, getAllBloodBanks);
router.patch("/bloodbanks/:id/approve",...isAdmin, approveBloodBank);
router.patch("/bloodbanks/:id/reject", ...isAdmin, rejectBloodBank);
router.delete("/bloodbanks/:id",       ...isAdmin, deleteBloodBank);
router.get("/analytics",              ...isAdmin, getAnalytics);

module.exports = router;
