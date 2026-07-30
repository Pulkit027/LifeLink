const BloodBank = require("../models/BloodBank");
const Donation = require("../models/Donation");
const Request = require("../models/Request");
const { createNotification } = require("./notificationController");

// ── Helper: find blood bank owned by this user ────────────────────────────────
const getOwnBank = async (userId) => {
  return BloodBank.findOne({ ownerUserId: userId, approvalStatus: "approved" });
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/inventory
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.getInventory = async (req, res) => {
  try {
    const bank = await BloodBank.findOne({ ownerUserId: req.user._id });
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }
    res.json({ success: true, bank });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PUT /api/inventory
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.updateStock = async (req, res) => {
  try {
    const { bloodGroup, units, operation } = req.body;
    // operation: "add" | "subtract"
    const validGroups = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
    if (!validGroups.includes(bloodGroup)) {
      return res.status(400).json({ success: false, msg: "Invalid blood group." });
    }
    if (!units || units <= 0) {
      return res.status(400).json({ success: false, msg: "Units must be positive." });
    }

    const bank = await getOwnBank(req.user._id);
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Approved blood bank not found." });
    }

    const current = bank.availableBlood[bloodGroup] || 0;
    if (operation === "subtract") {
      if (current < units) {
        return res.status(400).json({ success: false, msg: "Insufficient stock." });
      }
      bank.availableBlood[bloodGroup] = current - units;
    } else {
      bank.availableBlood[bloodGroup] = current + Number(units);
    }

    bank.markModified("availableBlood");
    await bank.save();

    res.json({ success: true, msg: "Stock updated.", bank });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/inventory/donations
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.getPendingDonations = async (req, res) => {
  try {
    const bank = await BloodBank.findOne({ ownerUserId: req.user._id });
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }

    const donations = await Donation.find({
      bloodBank: bank.bankName,
      status: "pending",
    })
      .populate("donorId", "name email bloodGroup")
      .sort({ createdAt: -1 });

    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/inventory/donations/:id
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, msg: "Invalid status." });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, msg: "Donation not found." });
    }

    donation.status = status;
    await donation.save();

    // Update inventory on approval
    if (status === "approved") {
      const bank = await getOwnBank(req.user._id);
      if (bank) {
        const bg = donation.bloodGroup;
        bank.availableBlood[bg] = (bank.availableBlood[bg] || 0) + donation.quantity;
        bank.markModified("availableBlood");
        await bank.save();
      }
    }

    // Notify donor
    if (donation.donorId) {
      await createNotification(
        donation.donorId,
        status === "approved" ? "Donation Approved! 🩸" : "Donation Update",
        status === "approved"
          ? `Your donation of ${donation.quantity} unit(s) of ${donation.bloodGroup} has been approved.`
          : `Your donation has been reviewed. Status: ${status}.`,
        status === "approved" ? "success" : "warning"
      );
    }

    res.json({ success: true, msg: `Donation ${status}.`, donation });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/inventory/requests
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.getNearbyRequests = async (req, res) => {
  try {
    const bank = await BloodBank.findOne({ ownerUserId: req.user._id });
    if (!bank) {
      return res.status(404).json({ success: false, msg: "Blood bank not found." });
    }

    // Find open requests in the same city
    const requests = await Request.find({
      city: { $regex: bank.city, $options: "i" },
      status: "open",
    })
      .populate("requesterId", "name email phone")
      .sort({ urgency: -1, createdAt: -1 }); // Emergency first

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/inventory/requests/:id
// @access Blood Bank
// ────────────────────────────────────────────────────────────────────────────
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "accepted", acceptedBy: req.user._id },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, msg: "Request not found." });
    }

    // Notify requester
    if (request.requesterId) {
      await createNotification(
        request.requesterId,
        "Blood Request Accepted! 🩸",
        `Your request for ${request.quantity} unit(s) of ${request.bloodGroup} has been accepted.`,
        "success"
      );
    }

    res.json({ success: true, msg: "Request accepted.", request });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};
