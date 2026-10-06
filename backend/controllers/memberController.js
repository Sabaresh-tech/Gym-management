const Member = require("../models/Member");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all members
// @route   GET /api/members
const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: members.length, data: members });
});

// @desc    Get a single member by id
// @route   GET /api/members/:id
const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.status(200).json({ success: true, data: member });
});

// @desc    Get current logged in member's profile
// @route   GET /api/members/me
const getMe = asyncHandler(async (req, res) => {
  // Check if current user is a member
  if (req.user.role !== "member") {
    res.status(403);
    throw new Error("Not authorized as a member");
  }
  
  const member = await Member.findOne({ userId: req.user._id }).populate("membershipId");
  if (!member) {
    res.status(404);
    throw new Error("Member profile not found");
  }
  
  res.status(200).json({ success: true, data: member });
});

// @desc    Create a new member
// @route   POST /api/members
const createMember = asyncHandler(async (req, res) => {
  const { memberId, name, email, phone, dateOfBirth, gender, membershipPlan, status, password } = req.body;

  let user = null;
  
  if (password) {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists.");
    }
    
    // Create user account
    user = await User.create({
      name,
      email,
      password, // Password hashing is handled by User model pre-save hook
      role: "member"
    });
  }

  try {
    // Create member profile
    const memberData = {
      memberId, name, email, phone, dateOfBirth, gender, membershipPlan, status,
      ...(user && { userId: user._id })
    };
    const member = await Member.create(memberData);
    res.status(201).json({ success: true, message: "Member created successfully", data: member });
  } catch (error) {
    // Clean up created user if member creation fails
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    throw error;
  }
});

// @desc    Update an existing member
// @route   PUT /api/members/:id
const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.status(200).json({ success: true, message: "Member updated successfully", data: member });
});

// @desc    Delete a member
// @route   DELETE /api/members/:id
const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.status(200).json({ success: true, message: "Member deleted successfully", data: member });
});

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember, getMe };
