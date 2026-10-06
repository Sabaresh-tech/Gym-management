const { validationResult } = require("express-validator");

// Runs after a chain of express-validator checks. If any failed, responds
// with the project's standard error shape instead of letting a bad record
// reach Mongoose/MongoDB at all — this is the "reject before it touches the
// database" layer that sits in front of the Mongoose-level validation
// already added in Experiment 4.
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validateRequest;
