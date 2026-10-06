const express = require("express");
const {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} = require("../controllers/membershipController");
const validate = require("../middleware/validate");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createMembershipValidator,
  updateMembershipValidator,
  idParamValidator,
} = require("../validators/membershipValidators");

const router = express.Router();

// Experiment 6 — every route below now requires a valid JWT.
router.use(protect);

router
  .route("/")
  .get(authorizeRoles("admin", "staff"), getMemberships)
  .post(authorizeRoles("admin"), createMembershipValidator, validate, createMembership);

router
  .route("/:id")
  .get(authorizeRoles("admin", "staff"), idParamValidator, validate, getMembershipById)
  .put(authorizeRoles("admin"), updateMembershipValidator, validate, updateMembership)
  .delete(authorizeRoles("admin"), idParamValidator, validate, deleteMembership);

module.exports = router;
