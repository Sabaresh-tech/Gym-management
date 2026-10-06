const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validate = require("../middleware/validate");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createUserValidator,
  registerValidator,
  loginValidator,
  updateUserValidator,
  idParamValidator,
} = require("../validators/userValidators");

const router = express.Router();

// --- Experiment 6 — auth endpoints --------------------------------------
// POST /api/users/register — public, creates an admin/staff account.
router.post("/register", registerValidator, validate, registerUser);

// POST /api/users/login — public, returns a JWT.
router.post("/login", loginValidator, validate, loginUser);

// GET /api/users/me — any authenticated user.
router.get("/me", protect, getMe);

// --- User management (admin only) ---------------------------------------
router
  .route("/")
  .get(protect, authorizeRoles("admin"), getUsers)
  .post(protect, authorizeRoles("admin"), createUserValidator, validate, createUser);

router
  .route("/:id")
  .get(protect, authorizeRoles("admin"), idParamValidator, validate, getUser)
  .put(protect, authorizeRoles("admin"), updateUserValidator, validate, updateUser)
  .delete(protect, authorizeRoles("admin"), idParamValidator, validate, deleteUser);

module.exports = router;
