// Wraps an async Express route handler so any thrown/rejected error is
// forwarded to next(), where errorMiddleware.js turns it into a consistent
// JSON error response instead of crashing the process.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
