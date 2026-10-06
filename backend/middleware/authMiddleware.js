const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

// Verifies "Authorization: Bearer <token>", attaches the authenticated
// user's safe info to req.user, and calls next(). Responds 401 for any
// missing/malformed/expired/invalid token — never leaks JWT_SECRET or
// internal jwt error details in the response.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401);
    throw new Error("Authentication required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Covers TokenExpiredError, JsonWebTokenError (malformed/invalid), etc.
    res.status(401);
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Invalid or expired token");
  }

  // req.user is the safe Mongoose document (password has `select: false`,
  // so it isn't loaded here at all).
  req.user = user;
  next();
});

// authorizeRoles("admin"), authorizeRoles("admin", "staff"), etc.
// Must run after `protect` so req.user is already populated.
function authorizeRoles(...roles) {
  return function checkRole(req, res, next) {
    if (!req.user) {
      res.status(401);
      return next(new Error("Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error("Access denied"));
    }
    next();
  };
}

module.exports = { protect, authorizeRoles };
