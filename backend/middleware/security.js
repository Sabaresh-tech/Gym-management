const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// Sets a battery of secure HTTP headers (no X-Powered-By, HSTS, no-sniff,
// frameguard, etc.) with sane defaults for a JSON API.
const secureHeaders = helmet();

// Global rate limiter applied to /api — protects against brute-force and
// basic denial-of-service traffic. Configurable via env vars so it can be
// loosened for a live Postman demo without touching code.
const apiRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Strips any key starting with "$" or containing "." from req.body,
// req.params and req.query — prevents NoSQL/operator injection like
// { "email": { "$gt": "" } } from reaching a Mongoose query.
const sanitizeMongoOperators = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ key }) => {
    console.warn(`[security] Sanitized a potentially malicious key: "${key}"`);
  },
});

// Prevents HTTP Parameter Pollution (e.g. ?status=active&status=$ne)
// from producing arrays where a single value is expected.
const preventParamPollution = hpp();

module.exports = {
  secureHeaders,
  apiRateLimiter,
  sanitizeMongoOperators,
  preventParamPollution,
};
