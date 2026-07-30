const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    // ── Requester Reference (optional for backward compat) ────────────────────
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Request Details (existing fields preserved) ───────────────────────────
    name:       { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    quantity:   { type: Number, default: 1 },
    city:       { type: String, default: "" },

    // ── Urgency & Status ──────────────────────────────────────────────────────
    urgency: {
      type: String,
      enum: ["normal", "emergency"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["open", "accepted", "fulfilled", "cancelled"],
      default: "open",
    },

    // ── Accepted By (Donor or Blood Bank) ─────────────────────────────────────
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Notes ─────────────────────────────────────────────────────────────────
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);