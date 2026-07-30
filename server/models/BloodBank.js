const mongoose = require("mongoose");

// ── Blood inventory sub-schema ────────────────────────────────────────────────
const bloodStockSchema = new mongoose.Schema(
  {
    "A+":  { type: Number, default: 0 },
    "A-":  { type: Number, default: 0 },
    "B+":  { type: Number, default: 0 },
    "B-":  { type: Number, default: 0 },
    "O+":  { type: Number, default: 0 },
    "O-":  { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
  },
  { _id: false }
);

const bloodBankSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    bankName: {
      type: String,
      required: [true, "Blood bank name is required"],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      trim: true,
    },

    // ── Location & Contact ────────────────────────────────────────────────────
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    contactNumber: {
      type: String,
      default: "",
    },
    operatingHours: {
      type: String,
      default: "9:00 AM – 5:00 PM",
    },

    // ── Ownership ─────────────────────────────────────────────────────────────
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Status ────────────────────────────────────────────────────────────────
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ── Blood Inventory ───────────────────────────────────────────────────────
    availableBlood: {
      type: bloodStockSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodBank", bloodBankSchema);
