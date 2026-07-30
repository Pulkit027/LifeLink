const router = require("express").Router();
const {
  getMyNotifications,
  markAsRead,
  markAllRead,
} = require("../controllers/notificationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// All routes require authentication
router.get("/",               ...isAuthenticated, getMyNotifications);
router.patch("/read-all",     ...isAuthenticated, markAllRead);
router.patch("/:id/read",     ...isAuthenticated, markAsRead);

module.exports = router;
