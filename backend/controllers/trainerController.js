const Trainer = require("../models/Trainer");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all trainers
// @route   GET /api/trainers
const getTrainers = asyncHandler(async (req, res) => {
  const trainers = await Trainer.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: trainers.length, data: trainers });
});

// @desc    Get a single trainer by id
// @route   GET /api/trainers/:id
const getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  res.status(200).json({ success: true, data: trainer });
});

// @desc    Get current logged in trainer's profile
// @route   GET /api/trainers/me
const getMe = asyncHandler(async (req, res) => {
  // Check if current user is a trainer
  if (req.user.role !== "trainer") {
    res.status(403);
    throw new Error("Not authorized as a trainer");
  }
  
  const trainer = await Trainer.findOne({ userId: req.user._id });
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer profile not found");
  }
  
  res.status(200).json({ success: true, data: trainer });
});

// @desc    Create a new trainer
// @route   POST /api/trainers
const createTrainer = asyncHandler(async (req, res) => {
  const { trainerId, name, email, phone, specialization, experience, status, password } = req.body;

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
      role: "trainer"
    });
  }

  try {
    // Create trainer profile
    const trainerData = {
      trainerId, name, email, phone, specialization, experience, status,
      ...(user && { userId: user._id })
    };
    const trainer = await Trainer.create(trainerData);
    res.status(201).json({ success: true, message: "Trainer created successfully", data: trainer });
  } catch (error) {
    // Clean up created user if trainer creation fails
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    throw error;
  }
});

// @desc    Update an existing trainer
// @route   PUT /api/trainers/:id
const updateTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  res.status(200).json({ success: true, message: "Trainer updated successfully", data: trainer });
});

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
const deleteTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findByIdAndDelete(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  res.status(200).json({ success: true, message: "Trainer deleted successfully", data: trainer });
});

module.exports = { getTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer, getMe };
