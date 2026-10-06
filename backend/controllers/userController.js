const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const generateToken = require("../utils/generateToken");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (admin only)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, data: user });
});

// @desc    Create new user (admin managing staff/admin accounts directly)
// @route   POST /api/users
// @access  Private (admin only)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("A user with this email already exists");
  }

  // Password is hashed automatically by the pre("save") hook on the model,
  // triggered here because User.create() runs a full document save.
  const user = await User.create({ name, email, password, role, phone });
  res.status(201).json({ success: true, message: "User created successfully", data: user });
});

// @desc    Register a new admin/staff account
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "staff",
  });

  const token = generateToken(user);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    data: user, // password stripped by the model's toJSON transform
  });
});

// @desc    Login and receive a JWT
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Password has `select: false` on the schema, so it must be explicitly
  // requested here to compare it.
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  // Deliberately generic message for both "no such email" and "wrong
  // password" so login doesn't leak which emails have accounts.
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: user,
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/users/me
// @access  Private (any authenticated user)
const getMe = asyncHandler(async (req, res) => {
  // req.user is already the safe, hydrated user document from authMiddleware.
  res.status(200).json({ success: true, data: req.user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (admin only)
const updateUser = asyncHandler(async (req, res) => {
  // Password changes are intentionally out of scope for this generic CRUD
  // endpoint — findByIdAndUpdate() would bypass the model's hashing hook
  // and store it as plain text, so it's stripped here rather than risk that.
  const { password, ...updates } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, message: "User updated successfully", data: user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, message: "User deleted successfully", data: {} });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
};
