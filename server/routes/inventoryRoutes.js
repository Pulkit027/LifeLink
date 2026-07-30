const router = require("express").Router();
const {
  getInventory,
  updateStock,
  getPendingDonations,
  updateDonationStatus,
  getNearbyRequests,
  acceptRequest,
} = require("../controllers/bloodBankController");
const { isBloodBank } = require("../middleware/authMiddleware");

// All routes require Blood Bank or Admin role
router.get("/",                   ...isBloodBank, getInventory);
router.put("/",                   ...isBloodBank, updateStock);
router.get("/donations",          ...isBloodBank, getPendingDonations);
router.patch("/donations/:id",    ...isBloodBank, updateDonationStatus);
router.get("/requests",           ...isBloodBank, getNearbyRequests);
router.patch("/requests/:id",     ...isBloodBank, acceptRequest);

module.exports = router;
