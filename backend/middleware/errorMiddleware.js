// 404 handler for unmatched API routes.
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Centralized error handler. Normalizes Mongoose validation errors,
// duplicate-key errors, and bad ObjectId casts into readable messages,
// and otherwise falls back to a generic 500.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Prefer a status code the error already carries (e.g. body-parser sets
  // err.statusCode = 400 for malformed JSON before any route runs). Fall
  // back to whatever a controller already set via res.status(...), then
  // to 500 if neither is present.
  let statusCode =
    err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Server error";

  // Malformed JSON body (body-parser / express.json()).
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON in request body.";
  }

  // Mongoose validation error (missing/invalid required fields).
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose duplicate key error (e.g. unique email/memberId/planId).
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    message = `A record with this ${field} already exists${value ? ` ("${value}")` : ""}.`;
  }

  // Mongoose bad ObjectId (e.g. GET /api/members/not-a-valid-id).
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFound, errorHandler };
