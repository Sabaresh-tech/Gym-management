const mongoose = require("mongoose");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    trainerId: {
      type: String,
      required: [true, "trainerId is required"],
      unique: true,
      trim: true,
    },
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
      required: [true, "phone is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "experience (in years) is required"],
      min: [0, "experience cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "on_leave", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainer", trainerSchema);
