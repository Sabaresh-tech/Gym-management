const express = require("express");
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMe,
} = require("../controllers/memberController");
const validate = require("../middleware/validate");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createMemberValidator,
  updateMemberValidator,
  idParamValidator,
} = require("../validators/memberValidators");

const router = express.Router();

// Experiment 6 — every route below now requires a valid JWT.
router.use(protect);

// GET /api/members (admin + staff), POST /api/members (admin)
router
  .route("/")
  .get(authorizeRoles("admin", "staff"), getMembers)
  .post(authorizeRoles("admin"), createMemberValidator, validate, createMember);

// GET /api/members/me
router.get("/me", getMe);

// GET /api/members/:id (admin + staff), PUT (admin), DELETE (admin)
router
  .route("/:id")
  .get(authorizeRoles("admin", "staff"), idParamValidator, validate, getMemberById)
  .put(authorizeRoles("admin"), updateMemberValidator, validate, updateMember)
  .delete(authorizeRoles("admin"), idParamValidator, validate, deleteMember);

module.exports = router;
