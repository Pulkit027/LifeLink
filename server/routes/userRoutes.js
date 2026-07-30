const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/userController");
const { isAdmin } = require("../middleware/authMiddleware");

// All routes are admin-only
router.get("/",              ...isAdmin, getAllUsers);
router.get("/:id",           ...isAdmin, getUserById);
router.patch("/:id/role",    ...isAdmin, updateUserRole);
router.patch("/:id/block",   ...isAdmin, toggleBlockUser);
router.delete("/:id",        ...isAdmin, deleteUser);

module.exports = router;
