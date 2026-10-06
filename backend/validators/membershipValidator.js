const { body, param } = require("express-validator");

const mongoIdParam = param("id").isMongoId().withMessage("Invalid membership id");

const createMembershipRules = [
  body("planId").trim().notEmpty().withMessage("planId is required"),
  body("planName")
    .trim()
    .notEmpty()
    .withMessage("planName is required")
    .isIn(["Basic", "Standard", "Premium", "Elite", "Annual", "Student"])
    .withMessage("planName must be one of Basic, Standard, Premium, Elite, Annual, Student"),
  body("duration").trim().notEmpty().withMessage("duration is required"),
  body("price").notEmpty().withMessage("price is required").isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("status").optional().isIn(["active", "inactive"]),
];

const updateMembershipRules = [
  mongoIdParam,
  body("planName").optional().isIn(["Basic", "Standard", "Premium", "Elite", "Annual", "Student"]),
  body("price").optional().isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("status").optional().isIn(["active", "inactive"]),
];

const idParamRule = [mongoIdParam];

module.exports = { createMembershipRules, updateMembershipRules, idParamRule };
