const { body, param } = require("express-validator");

const STATUSES = ["checked_in", "checked_out"];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createAttendanceValidator = [
  body("memberId").trim().notEmpty().withMessage("memberId is required"),
  body("date").notEmpty().withMessage("date is required").isISO8601().withMessage("date must be a valid date"),
  body("checkIn").trim().notEmpty().withMessage("checkIn is required").matches(TIME_REGEX).withMessage("checkIn must be in HH:mm format"),
  body("checkOut").optional({ values: "falsy" }).trim().matches(TIME_REGEX).withMessage("checkOut must be in HH:mm format"),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const updateAttendanceValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  body("memberId").optional().trim().notEmpty().withMessage("memberId cannot be empty"),
  body("date").optional().isISO8601().withMessage("date must be a valid date"),
  body("checkIn").optional().trim().matches(TIME_REGEX).withMessage("checkIn must be in HH:mm format"),
  body("checkOut").optional({ values: "falsy" }).trim().matches(TIME_REGEX).withMessage("checkOut must be in HH:mm format"),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const idParamValidator = [param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId")];

module.exports = { createAttendanceValidator, updateAttendanceValidator, idParamValidator };
