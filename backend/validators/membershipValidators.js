const { body, param } = require("express-validator");

const PLAN_NAMES = ["Basic", "Standard", "Premium", "Elite", "Annual", "Student"];
const STATUSES = ["active", "inactive"];

const createMembershipValidator = [
  body("planId").trim().notEmpty().withMessage("planId is required"),
  body("planName").trim().notEmpty().withMessage("planName is required").isIn(PLAN_NAMES).withMessage(`planName must be one of: ${PLAN_NAMES.join(", ")}`),
  body("duration").trim().notEmpty().withMessage("duration is required"),
  body("price").notEmpty().withMessage("price is required").isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 500 }),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const updateMembershipValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  body("planId").optional().trim().notEmpty().withMessage("planId cannot be empty"),
  body("planName").optional().trim().isIn(PLAN_NAMES).withMessage(`planName must be one of: ${PLAN_NAMES.join(", ")}`),
  body("duration").optional().trim().notEmpty().withMessage("duration cannot be empty"),
  body("price").optional().isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 500 }),
  body("status").optional({ values: "falsy" }).isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

const idParamValidator = [param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId")];

module.exports = { createMembershipValidator, updateMembershipValidator, idParamValidator };
