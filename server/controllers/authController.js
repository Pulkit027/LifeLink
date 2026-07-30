const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BloodBank = require("../models/BloodBank");
const { createNotification } = require("./notificationController");

// ── Generate JWT ──────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "lifelink_super_secret_jwt_key_2024_secure",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/auth/register
// @access Public
// ────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      name, email, phone, password, confirmPassword,
      role, bloodGroup, gender, age, city, address,
      // Blood bank specific fields
      bankName, licenseNumber, registrationNumber, operatingHours,
    } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Name, email, and password are required." });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, msg: "Passwords do not match." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, msg: "Password must be at least 6 characters." });
    }

    // ── Check Duplicate Email ─────────────────────────────────────────────────
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, msg: "Email is already registered." });
    }

    // ── Validate Blood Bank Role ──────────────────────────────────────────────
    if (role === "bloodbank" && (!bankName || !licenseNumber || !registrationNumber)) {
      return res.status(400).json({
        success: false,
        msg: "Blood bank name, license number, and registration number are required.",
      });
    }

    // ── Create User ───────────────────────────────────────────────────────────
    const user = await User.create({
      name,
      email,
      phone,
      password, // hashed via pre-save hook
      role: role || "donor",
      bloodGroup,
      gender,
      age: age ? Number(age) : null,
      city,
      address,
    });

    // ── If Blood Bank, create BloodBank document ──────────────────────────────
    if (role === "bloodbank") {
      await BloodBank.create({
        bankName,
        licenseNumber,
        registrationNumber,
        city,
        address,
        contactNumber: phone,
        operatingHours: operatingHours || "9:00 AM – 5:00 PM",
        ownerUserId: user._id,
        approvalStatus: "pending",
      });
    }

    // ── Send welcome notification ─────────────────────────────────────────────
    await createNotification(
      user._id,
      "Welcome to LifeLink! 🩸",
      role === "bloodbank"
        ? "Your blood bank registration is pending admin approval."
        : "Your account has been created successfully. Start saving lives today!",
      "success"
    );

    // ── Generate JWT ──────────────────────────────────────────────────────────
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      msg: "Registration successful.",
      token,
      user: user.toJSON(), // password excluded via toJSON
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, msg: err.message || "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/auth/login
// @access Public
// ────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Email and password are required." });
    }

    // Find user — explicitly select password (it's select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password." });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        msg: "Your account has been blocked. Contact admin for support.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      msg: "Login successful.",
      token,
      user: user.toJSON(), // password excluded
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @route  POST /api/auth/logout
// @access Public (stateless JWT — client deletes token)
// ────────────────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.json({ success: true, msg: "Logged out successfully." });
};

// ────────────────────────────────────────────────────────────────────────────
// @route  GET /api/auth/me
// @access Protected (verifyJWT)
// ────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.user is already populated by verifyJWT middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error." });
  }
};