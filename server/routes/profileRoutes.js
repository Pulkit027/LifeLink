const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadPhoto,
  getStats,
} = require("../controllers/profileController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All routes require authentication
router.get("/",          ...isAuthenticated, getProfile);
router.put("/",          ...isAuthenticated, updateProfile);
router.put("/password",  ...isAuthenticated, changePassword);
router.post("/photo",    ...isAuthenticated, upload.single("photo"), uploadPhoto);
router.get("/stats",     ...isAuthenticated, getStats);

module.exports = router;
