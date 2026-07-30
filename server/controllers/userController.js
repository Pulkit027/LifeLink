const User = require("../models/User");
const { createNotification } = require("./notificationController");

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/users
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city:  { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ success: true, users, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/users/:id
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/users/:id/role
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ["donor", "recipient", "bloodbank", "admin"];
    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, msg: "Invalid role." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: "-password" }
    );
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    await createNotification(
      user._id,
      "Role Updated",
      `Your account role has been changed to: ${role}.`,
      "info"
    );

    res.json({ success: true, msg: "Role updated.", user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/users/:id/block
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, msg: "Cannot block your own account." });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    if (!user.isBlocked) {
      await createNotification(
        user._id,
        "Account Unblocked",
        "Your account has been unblocked by the admin.",
        "success"
      );
    }

    res.json({
      success: true,
      msg: user.isBlocked ? "User blocked." : "User unblocked.",
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  DELETE /api/users/:id
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, msg: "Cannot delete your own account." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    res.json({ success: true, msg: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};
