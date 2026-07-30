const Donation = require("../models/Donation");
const Request = require("../models/Request");
const { createNotification } = require("./notificationController");

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/request
// @access Recipient / Admin (public for backward compat)
// ────────────────────────────────────────────────────────────────────────────
exports.createRequest = async (req, res) => {
  try {
    const { name, bloodGroup, quantity, city, urgency, notes } = req.body;

    console.log("REQ BODY:", req.body); // 🔥 preserved debug

    const newRequest = await Request.create({
      name,
      bloodGroup,
      quantity,
      city,
      urgency: urgency || "normal",
      notes: notes || "",
      requesterId: req.user ? req.user._id : null,
    });

    // 🔔 Notify if emergency
    if (urgency === "emergency" && req.user) {
      await createNotification(
        req.user._id,
        "Emergency Request Submitted",
        `Your emergency request for ${quantity} unit(s) of ${bloodGroup} in ${city} has been submitted.`,
        "alert"
      );
    }

    res.json(newRequest);
  } catch (err) {
    console.error("REQUEST ERROR:", err); // 🔥 preserved
    res.status(500).json({ msg: "Error creating request" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/request
// @access Public
// ────────────────────────────────────────────────────────────────────────────
exports.getRequests = async (req, res) => {
  try {
    const { bloodGroup, city, status, urgency } = req.query;
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city)       query.city = { $regex: city, $options: "i" };
    if (status)     query.status = status;
    if (urgency)    query.urgency = urgency;

    const data = await Request.find(query)
      .sort({ urgency: -1, createdAt: -1 }); // Emergency first

    res.json(data);
  } catch (err) {
    console.error("GET REQUEST ERROR:", err);
    res.status(500).json({ msg: "Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/request/mine
// @access Recipient (authenticated)
// ────────────────────────────────────────────────────────────────────────────
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/request/recent
// @access Public (preserved from original)
// ────────────────────────────────────────────────────────────────────────────
exports.getRecentRequests = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const data = await Request.find({ createdAt: { $gte: twoDaysAgo } });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  PATCH /api/request/:id/status
// @access Protected (recipient can cancel own; donor/bloodbank can accept)
// ────────────────────────────────────────────────────────────────────────────
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, msg: "Request not found." });
    }

    // Recipient can only cancel their own
    if (req.user.role === "recipient") {
      if (request.requesterId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, msg: "Not your request." });
      }
      if (status !== "cancelled") {
        return res.status(403).json({ success: false, msg: "Recipients can only cancel requests." });
      }
    }

    // Donor accepting an emergency request
    if (req.user.role === "donor" && status === "accepted") {
      request.acceptedBy = req.user._id;
      // Award reward points for accepting emergency
      if (request.urgency === "emergency") {
        const User = require("../models/User");
        await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: 20 } });
      }
    }

    request.status = status;
    await request.save();

    // Notify requester if their request was accepted/fulfilled
    if (request.requesterId && ["accepted", "fulfilled"].includes(status)) {
      await createNotification(
        request.requesterId,
        "Blood Request Update",
        `Your request for ${request.quantity} unit(s) of ${request.bloodGroup} is now ${status}.`,
        "success"
      );
    }

    res.json({ success: true, msg: `Request ${status}.`, request });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  DELETE /api/request/:id
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, msg: "Request not found." });
    }
    res.json({ success: true, msg: "Request deleted." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/request/find-blood
// @access Public (preserved from original)
// ────────────────────────────────────────────────────────────────────────────
exports.findBloodBanks = async (req, res) => {
  try {
    const { bloodGroup } = req.body;

    const data = await Donation.aggregate([
      { $match: { bloodGroup } },
      {
        $group: {
          _id: { bloodBank: "$bloodBank", city: "$city" },
          totalUnits: { $sum: "$quantity" },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};