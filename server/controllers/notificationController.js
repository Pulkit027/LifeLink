const Notification = require("../models/Notification");

// ────────────────────────────────────────────────────────────────────────────
// UTILITY — createNotification (used internally by other controllers)
// ────────────────────────────────────────────────────────────────────────────
const createNotification = async (userId, title, message, type = "info", link = "") => {
  try {
    await Notification.create({ userId, title, message, type, link });
  } catch (err) {
    // Non-fatal — just log
    console.error("Notification creation error:", err.message);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/notifications
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId: req.user._id });
    const unread = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.json({ success: true, notifications, total, unread, page });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/notifications/:id/read
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, msg: "Notification not found." });
    }
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/notifications/read-all
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, msg: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// Export utility for use in other controllers
exports.createNotification = createNotification;
