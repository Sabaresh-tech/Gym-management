const { validationResult } = require("express-validator");

// Runs after a chain of express-validator checks. If any failed, responds
// 400 with every field error instead of letting the request reach the
// database — this is the app-level validation layer that sits in front of
// the Mongoose schema validation from Experiment 4 (defense in depth: bad
// input is rejected before a query is even attempted).
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  res.status(400).json({
    success: false,
    message: errors.map((e) => e.message).join(", "),
    errors,
  });
}

module.exports = validate;
