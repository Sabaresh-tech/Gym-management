const { body, param } = require("express-validator");

const MEMBER_STATUSES = ["active", "pending", "suspended", "expired"];
const GENDERS = ["male", "female", "other", "prefer_not_to_say"];

// POST /api/members — every field required, matching the Mongoose schema.
const createMemberValidator = [
  body("memberId").trim().notEmpty().withMessage("memberId is required"),
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email must be a valid address").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("membershipPlan").trim().notEmpty().withMessage("membershipPlan is required"),
  body("dateOfBirth").optional({ values: "falsy" }).isISO8601().withMessage("dateOfBirth must be a valid date"),
  body("gender").optional({ values: "falsy" }).isIn(GENDERS).withMessage(`gender must be one of: ${GENDERS.join(", ")}`),
  body("joinDate").optional({ values: "falsy" }).isISO8601().withMessage("joinDate must be a valid date"),
  body("status").optional({ values: "falsy" }).isIn(MEMBER_STATUSES).withMessage(`status must be one of: ${MEMBER_STATUSES.join(", ")}`),
];

// PUT /api/members/:id — every field optional (partial update), but must
// still be well-formed if present.
const updateMemberValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  body("memberId").optional().trim().notEmpty().withMessage("memberId cannot be empty"),
  body("name").optional().trim().notEmpty().withMessage("name cannot be empty").isLength({ max: 100 }),
  body("email").optional().trim().isEmail().withMessage("email must be a valid address").normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("phone must be a valid phone number"),
  body("dateOfBirth").optional({ values: "falsy" }).isISO8601().withMessage("dateOfBirth must be a valid date"),
  body("gender").optional({ values: "falsy" }).isIn(GENDERS).withMessage(`gender must be one of: ${GENDERS.join(", ")}`),
  body("joinDate").optional({ values: "falsy" }).isISO8601().withMessage("joinDate must be a valid date"),
  body("status").optional({ values: "falsy" }).isIn(MEMBER_STATUSES).withMessage(`status must be one of: ${MEMBER_STATUSES.join(", ")}`),
];

const idParamValidator = [param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId")];

module.exports = { createMemberValidator, updateMemberValidator, idParamValidator };
