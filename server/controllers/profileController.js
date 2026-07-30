const User = require("../models/User");
const Donation = require("../models/Donation");
const Request = require("../models/Request");
const path = require("path");

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/profile
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PUT /api/profile
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bloodGroup, gender, age, city, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bloodGroup, gender, age: age ? Number(age) : undefined, city, address },
      { new: true, runValidators: true, select: "-password" }
    );

    res.json({ success: true, msg: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message || "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PUT /api/profile/password
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, msg: "All fields are required." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, msg: "New passwords do not match." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, msg: "Password must be at least 6 characters." });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Current password is incorrect." });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({ success: true, msg: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/profile/photo
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded." });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoUrl },
      { new: true, select: "-password" }
    );

    res.json({ success: true, msg: "Photo uploaded.", user, photoUrl });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/profile/stats
// @access Protected
// ────────────────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role   = req.user.role;

    const stats = {};

    if (role === "donor" || role === "admin") {
      stats.totalDonations   = await Donation.countDocuments({ donorId: userId });
      stats.approvedDonations= await Donation.countDocuments({ donorId: userId, status: "approved" });
    }

    if (role === "recipient" || role === "admin") {
      stats.totalRequests    = await Request.countDocuments({ requesterId: userId });
      stats.openRequests     = await Request.countDocuments({ requesterId: userId, status: "open" });
      stats.fulfilledRequests= await Request.countDocuments({ requesterId: userId, status: "fulfilled" });
    }

    const user = await User.findById(userId).select("rewardPoints");
    stats.rewardPoints = user?.rewardPoints || 0;

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};
