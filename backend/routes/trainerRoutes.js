const express = require("express");
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getMe,
} = require("../controllers/trainerController");
const validate = require("../middleware/validate");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createTrainerValidator,
  updateTrainerValidator,
  idParamValidator,
} = require("../validators/trainerValidators");

const router = express.Router();

// Experiment 6 — every route below now requires a valid JWT.
router.use(protect);

router
  .route("/")
  .get(authorizeRoles("admin", "staff"), getTrainers)
  .post(authorizeRoles("admin"), createTrainerValidator, validate, createTrainer);

router.get("/me", getMe);

router
  .route("/:id")
  .get(authorizeRoles("admin", "staff"), idParamValidator, validate, getTrainerById)
  .put(authorizeRoles("admin"), updateTrainerValidator, validate, updateTrainer)
  .delete(authorizeRoles("admin"), idParamValidator, validate, deleteTrainer);

module.exports = router;
