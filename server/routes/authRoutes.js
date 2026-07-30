const router = require("express").Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const { verifyJWT } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   logout);

// Protected route — verify token, return current user
router.get("/me", verifyJWT, getMe);

module.exports = router;