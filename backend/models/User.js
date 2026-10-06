const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Experiment 6 — Authentication and User Roles with JWT.
//
// This is the same `users` collection used since Experiment 4, extended
// with the fields needed for real login: `password` (hashed, never
// returned by default) and a `role` used for JWT-based authorization.
//
// NOTE ON ROLES: earlier experiments stored broader UI-facing role values
// ("owner", "frontdesk", "trainer", "member") on this collection purely
// for the demo frontend's role-based navigation. Experiment 6 asks
// specifically for an admin/staff authentication scheme, which is also
// what backend/validators/userValidators.js already expected. The enum
// below is updated to ["admin", "staff"] to match. Any pre-existing
// documents with an old role value are left untouched in MongoDB (nothing
// here deletes or migrates data) — they simply won't pass validation if
// someone tries to re-save them with their old role. See the Experiment 6
// summary for how to migrate them if needed.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
      // Never returned by a normal query (User.find(), User.findById()...)
      // unless a controller explicitly does .select("+password").
      select: false,
    },
    role: {
      type: String,
      // Roles: admin, staff, member, trainer.
      // All four authenticate through POST /api/users/login and receive a JWT.
      // admin  — full management access
      // staff  — operational access (no admin-only pages)
      // member — self-service portal (own profile/membership/chat)
      // trainer— dedicated trainer dashboard + general chat
      enum: ["admin", "staff", "member", "trainer"],
      default: "staff",
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "expired"],
      default: "active",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say",
    },
  },
  {
    timestamps: true,
    // Belt-and-braces: even if a query ever does pull `password` back in,
    // strip it (and Mongo's internal __v) from any JSON response so it can
    // never leak through res.json({ data: user }).
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash the password whenever it's set/changed — covers User.create()
// (register, admin-created users) and user.save() after a password change.
// findByIdAndUpdate() deliberately does NOT trigger this (see userController
// updateUser), so password updates must go through .save() to be hashed.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method used by the login controller to check a plaintext
// candidate password against the stored bcrypt hash.
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
