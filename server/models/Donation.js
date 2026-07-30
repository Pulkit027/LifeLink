const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // ── Donor Reference (optional for backward compat with old records) ────────
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Donation Details (existing fields preserved) ──────────────────────────
    name:      { type: String, default: "" },
    bloodGroup:{ type: String, default: "" },
    quantity:  { type: Number, default: 1 },
    city:      { type: String, default: "" },
    bloodBank: { type: String, default: "" }, // Blood bank name (kept for backward compat)

    // ── Status Tracking ───────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ── Certificate ───────────────────────────────────────────────────────────
    certificateUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);