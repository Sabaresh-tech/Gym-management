const { body, param } = require("express-validator");

const mongoIdParam = param("id").isMongoId().withMessage("Invalid attendance id");
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm, 24-hour

const createAttendanceRules = [
  body("memberId").trim().notEmpty().withMessage("memberId is required"),
  body("date").optional({ values: "falsy" }).isISO8601().withMessage("date must be a valid date"),
  body("checkIn").trim().notEmpty().withMessage("checkIn is required").matches(TIME_REGEX).withMessage("checkIn must be in HH:mm format"),
  body("checkOut").optional({ values: "falsy" }).trim().matches(TIME_REGEX).withMessage("checkOut must be in HH:mm format"),
  body("status").optional().isIn(["checked_in", "checked_out"]),
];

const updateAttendanceRules = [
  mongoIdParam,
  body("date").optional({ values: "falsy" }).isISO8601().withMessage("date must be a valid date"),
  body("checkIn").optional().trim().matches(TIME_REGEX).withMessage("checkIn must be in HH:mm format"),
  body("checkOut").optional({ values: "falsy" }).trim().matches(TIME_REGEX).withMessage("checkOut must be in HH:mm format"),
  body("status").optional().isIn(["checked_in", "checked_out"]),
];

const idParamRule = [mongoIdParam];

module.exports = { createAttendanceRules, updateAttendanceRules, idParamRule };
