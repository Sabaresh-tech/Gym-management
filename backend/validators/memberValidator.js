const { body, param } = require("express-validator");

// Request-level validation (Experiment 5) — runs BEFORE the request reaches
// the controller/Mongoose. Complements, not replaces, the schema-level
// validation already defined on the Member model in Experiment 4.

const mongoIdParam = param("id").isMongoId().withMessage("Invalid member id");

const createMemberRules = [
  body("memberId").trim().notEmpty().withMessage("memberId is required"),
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email must be valid").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("dateOfBirth").optional({ values: "falsy" }).isISO8601().withMessage("dateOfBirth must be a valid date"),
  body("gender").optional().isIn(["male", "female", "other", "prefer_not_to_say"]),
  body("membershipPlan").trim().notEmpty().withMessage("membershipPlan is required"),
  body("joinDate").optional({ values: "falsy" }).isISO8601().withMessage("joinDate must be a valid date"),
  body("status").optional().isIn(["active", "pending", "suspended", "expired"]),
];

const updateMemberRules = [
  mongoIdParam,
  body("email").optional().trim().isEmail().withMessage("email must be valid").normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("dateOfBirth").optional({ values: "falsy" }).isISO8601().withMessage("dateOfBirth must be a valid date"),
  body("gender").optional().isIn(["male", "female", "other", "prefer_not_to_say"]),
  body("joinDate").optional({ values: "falsy" }).isISO8601().withMessage("joinDate must be a valid date"),
  body("status").optional().isIn(["active", "pending", "suspended", "expired"]),
];

const idParamRule = [mongoIdParam];

module.exports = { createMemberRules, updateMemberRules, idParamRule };
