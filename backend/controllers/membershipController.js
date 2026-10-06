const Membership = require("../models/Membership");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all membership plans
// @route   GET /api/memberships
const getMemberships = asyncHandler(async (req, res) => {
  const memberships = await Membership.find().sort({ price: 1 });
  res.status(200).json({ success: true, count: memberships.length, data: memberships });
});

// @desc    Get a single membership plan by id
// @route   GET /api/memberships/:id
const getMembershipById = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) {
    res.status(404);
    throw new Error("Membership plan not found");
  }
  res.status(200).json({ success: true, data: membership });
});

// @desc    Create a new membership plan
// @route   POST /api/memberships
const createMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.create(req.body);
  res.status(201).json({ success: true, message: "Membership plan created successfully", data: membership });
});

// @desc    Update an existing membership plan
// @route   PUT /api/memberships/:id
const updateMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!membership) {
    res.status(404);
    throw new Error("Membership plan not found");
  }
  res.status(200).json({ success: true, message: "Membership plan updated successfully", data: membership });
});

// @desc    Delete a membership plan
// @route   DELETE /api/memberships/:id
const deleteMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findByIdAndDelete(req.params.id);
  if (!membership) {
    res.status(404);
    throw new Error("Membership plan not found");
  }
  res.status(200).json({ success: true, message: "Membership plan deleted successfully", data: membership });
});

module.exports = {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
};
