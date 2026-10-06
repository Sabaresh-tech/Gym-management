const { body, param } = require("express-validator");

const STATUSES = ["active", "on_leave", "inactive"];

const createTrainerValidator = [
  body("trainerId").trim().notEmpty().withMessage("trainerId is required"),
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email must be a valid address").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("specialization").trim().notEmpty().withMessage("specialization is required"),
  body("experience").notEmpty().withMessage("experience is required").isFloat({ min: 0 }).withMessage("experience must be a non-negative number"),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const updateTrainerValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  body("trainerId").optional().trim().notEmpty().withMessage("trainerId cannot be empty"),
  body("name").optional().trim().notEmpty().withMessage("name cannot be empty").isLength({ max: 100 }),
  body("email").optional().trim().isEmail().withMessage("email must be a valid address").normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("specialization").optional().trim().notEmpty().withMessage("specialization cannot be empty"),
  body("experience").optional().isFloat({ min: 0 }).withMessage("experience must be a non-negative number"),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const idParamValidator = [param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId")];

module.exports = { createTrainerValidator, updateTrainerValidator, idParamValidator };
