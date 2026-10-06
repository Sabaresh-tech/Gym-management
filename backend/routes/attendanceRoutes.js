const express = require("express");
const {
  getAttendanceRecords,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const validate = require("../middleware/validate");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createAttendanceValidator,
  updateAttendanceValidator,
  idParamValidator,
} = require("../validators/attendanceValidators");

const router = express.Router();

// Experiment 6 — every route below now requires a valid JWT.
router.use(protect);

// Attendance can be recorded/updated by admin + staff, but only an admin
// may delete a record.
router
  .route("/")
  .get(authorizeRoles("admin", "staff"), getAttendanceRecords)
  .post(authorizeRoles("admin", "staff"), createAttendanceValidator, validate, createAttendance);

router
  .route("/:id")
  .get(authorizeRoles("admin", "staff"), idParamValidator, validate, getAttendanceById)
  .put(authorizeRoles("admin", "staff"), updateAttendanceValidator, validate, updateAttendance)
  .delete(authorizeRoles("admin"), idParamValidator, validate, deleteAttendance);

module.exports = router;
