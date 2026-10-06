const { body, param } = require("express-validator");

const mongoIdParam = param("id").isMongoId().withMessage("Invalid trainer id");

const createTrainerRules = [
  body("trainerId").trim().notEmpty().withMessage("trainerId is required"),
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email must be valid").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("specialization").trim().notEmpty().withMessage("specialization is required"),
  body("experience")
    .notEmpty()
    .withMessage("experience is required")
    .isFloat({ min: 0 })
    .withMessage("experience must be a non-negative number"),
  body("status").optional().isIn(["active", "on_leave", "inactive"]),
];

const updateTrainerRules = [
  mongoIdParam,
  body("email").optional().trim().isEmail().withMessage("email must be valid").normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("experience").optional().isFloat({ min: 0 }).withMessage("experience must be a non-negative number"),
  body("status").optional().isIn(["active", "on_leave", "inactive"]),
];

const idParamRule = [mongoIdParam];

module.exports = { createTrainerRules, updateTrainerRules, idParamRule };
