const Donation = require("../models/Donation");
const PDFDocument = require("pdfkit");
const { createNotification } = require("./notificationController");

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/donation
// @access Donor / Blood Bank (or public for backward compat)
// ────────────────────────────────────────────────────────────────────────────
exports.createDonation = async (req, res) => {
  try {
    const { name, bloodGroup, quantity, city, bloodBank } = req.body;

    // ✅ Save donation — attach donorId if user is authenticated
    const donation = await Donation.create({
      name,
      bloodGroup,
      quantity,
      city,
      bloodBank,
      donorId: req.user ? req.user._id : null, // backward compat: null if unauthenticated
    });

    // 🔥 CREATE PDF CERTIFICATE
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    doc.pipe(res);

    // 🎨 DESIGN (preserved exactly)
    doc.fontSize(22).text("LifeLink Donation Certificate", { align: "center" });
    doc.moveDown();
    doc.text("This certifies that", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(name || "Donor", { align: "center", underline: true });
    doc.moveDown();
    doc.fontSize(14).text("has successfully donated blood", { align: "center" });
    doc.moveDown();
    doc.text(`Blood Group: ${bloodGroup}`, { align: "center" });
    doc.text(`Units: ${quantity}`, { align: "center" });
    doc.text(`City: ${city}`, { align: "center" });
    doc.text(`Blood Bank: ${bloodBank}`, { align: "center" });
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(10).text("Certificate ID: " + donation._id, { align: "center", color: "gray" });

    doc.end();

    // 🔔 Send notification to authenticated donor
    if (req.user) {
      await createNotification(
        req.user._id,
        "Donation Submitted! 🩸",
        `Your donation of ${quantity} unit(s) of ${bloodGroup} at ${bloodBank} is pending approval.`,
        "success"
      );
      // Award reward points
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: 10 } });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generating certificate" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/donation
// @access Public (with optional filters)
// ────────────────────────────────────────────────────────────────────────────
exports.getDonations = async (req, res) => {
  try {
    const { bloodGroup, city, limit = 100 } = req.query;
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: city, $options: "i" };

    const data = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(data);
    console.log("GET DONATIONS:", data.length, "records"); // preserved debug
  } catch (err) {
    console.error("GET DONATION ERROR:", err);
    res.status(500).json({ msg: "Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/donation/mine
// @access Donor (authenticated)
// ────────────────────────────────────────────────────────────────────────────
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/donation/recent
// @access Public (preserved from original)
// ────────────────────────────────────────────────────────────────────────────
exports.getRecentDonations = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const data = await Donation.find({ createdAt: { $gte: twoDaysAgo } });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  DELETE /api/donation/:id
// @access Admin only
// ────────────────────────────────────────────────────────────────────────────
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, msg: "Donation not found." });
    }
    res.json({ success: true, msg: "Donation deleted." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};