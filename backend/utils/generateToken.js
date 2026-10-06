const jwt = require("jsonwebtoken");

// Signs a JWT containing only non-sensitive identity info (id + role) —
// never the password or any other sensitive field. JWT_SECRET must be set
// in backend/.env (see .env.example); this throws loudly instead of
// silently signing with `undefined` if it's missing.
function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
  }

  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

module.exports = generateToken;
