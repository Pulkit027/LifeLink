const User = require("../models/User");
const BloodBank = require("../models/BloodBank");
const Donation = require("../models/Donation");
const Request = require("../models/Request");
const { createNotification } = require("./notificationController");

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/admin/dashboard
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalRecipients,
      totalBloodBanks,
      totalDonations,
      totalRequests,
      pendingBanks,
      openRequests,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "recipient" }),
      BloodBank.countDocuments(),
      Donation.countDocuments(),
      Request.countDocuments(),
      BloodBank.countDocuments({ approvalStatus: "pending" }),
      Request.countDocuments({ status: "open" }),
    ]);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Blood group distribution
    const bloodGroupStats = await Donation.aggregate([
      { $group: { _id: "$bloodGroup", count: { $sum: 1 }, units: { $sum: "$quantity" } } },
      { $sort: { units: -1 } },
    ]);

    // City wise donations
    const cityStats = await Donation.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, totalDonors, totalRecipients, totalBloodBanks,
        totalDonations, totalRequests, pendingBanks, openRequests, recentUsers,
      },
      bloodGroupStats,
      cityStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/admin/bloodbanks
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.getAllBloodBanks = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (status) query.approvalStatus = status;

    const banks = await BloodBank.find(query)
      .populate("ownerUserId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await BloodBank.countDocuments(query);

    res.json({ success: true, banks, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/admin/bloodbanks/:id/approve
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.approveBloodBank = async (req, res) => {
  try {
    const bank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "approved" },
      { new: true }
    );
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }

    await createNotification(
      bank.ownerUserId,
      "Blood Bank Approved! 🎉",
      `Your blood bank "${bank.bankName}" has been approved by the admin. You can now manage inventory.`,
      "success"
    );

    res.json({ success: true, msg: "Blood bank approved.", bank });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/admin/bloodbanks/:id/reject
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.rejectBloodBank = async (req, res) => {
  try {
    const bank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "rejected" },
      { new: true }
    );
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }

    await createNotification(
      bank.ownerUserId,
      "Blood Bank Application Rejected",
      `Your blood bank application for "${bank.bankName}" has been rejected. Contact admin for details.`,
      "warning"
    );

    res.json({ success: true, msg: "Blood bank rejected.", bank });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  DELETE /api/admin/bloodbanks/:id
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.deleteBloodBank = async (req, res) => {
  try {
    const bank = await BloodBank.findByIdAndDelete(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }
    res.json({ success: true, msg: "Blood bank deleted." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/admin/analytics
// @access Admin
// ────────────────────────────────────────────────────────────────────────────
exports.getAnalytics = async (req, res) => {
  try {
    // Monthly donation trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await Donation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          units: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyRequests = await Request.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    res.json({ success: true, monthlyDonations, monthlyRequests, roleDistribution });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};
