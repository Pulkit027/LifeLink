const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Core Identity ────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Never returned in queries by default
    },

    // ── Role & Status ────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ["donor", "recipient", "bloodbank", "admin"],
      default: "donor",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ── Medical Info ─────────────────────────────────────────────────────────
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ""],
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    age: {
      type: Number,
      default: null,
    },

    // ── Location ─────────────────────────────────────────────────────────────
    city: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    profilePhoto: {
      type: String,
      default: "", // stores relative URL path e.g. /uploads/photo.jpg
    },

    // ── Gamification ─────────────────────────────────────────────────────────
    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash Password Before Save ────────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (or is new)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method: Compare Password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Exclude Password from JSON Output ────────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);