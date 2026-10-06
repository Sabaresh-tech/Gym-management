const { body, param } = require("express-validator");

// Experiment 5 — request-level validation for /api/users.
// Experiment 6 — extended with password rules + register/login validators.
// Runs BEFORE the controller so invalid payloads never reach Mongoose.

// "member" added for Experiment 8 chat demonstration account.
// "trainer" added to support trainer authentication.
const ROLES = ["admin", "staff", "member", "trainer"];

const passwordRule = body("password")
  .notEmpty()
  .withMessage("password is required")
  .isLength({ min: 6 })
  .withMessage("password must be at least 6 characters");

const createUserValidator = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be a valid address")
    .normalizeEmail(),
  passwordRule,
  body("role")
    .optional({ values: "falsy" })
    .isIn(ROLES)
    .withMessage(`role must be one of: ${ROLES.join(", ")}`),
];

// Same shape as createUserValidator — used by POST /api/users/register.
const registerValidator = createUserValidator;

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be a valid address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("password is required"),
];

const updateUserValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  body("name").optional().trim().notEmpty().withMessage("name cannot be empty").isLength({ max: 100 }),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("email must be a valid address")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("role")
    .optional({ values: "falsy" })
    .isIn(ROLES)
    .withMessage(`role must be one of: ${ROLES.join(", ")}`),
];

const idParamValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
];

module.exports = {
  createUserValidator,
  registerValidator,
  loginValidator,
  updateUserValidator,
  idParamValidator,
};
