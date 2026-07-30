const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // ── Target User ───────────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ── Content ───────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Type (controls icon/color on frontend) ────────────────────────────────
    type: {
      type: String,
      enum: ["info", "success", "warning", "alert"],
      default: "info",
    },

    // ── Read Status ───────────────────────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },

    // ── Optional Link ─────────────────────────────────────────────────────────
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
