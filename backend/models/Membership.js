const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: [true, "planId is required"],
      unique: true,
      trim: true,
    },
    planName: {
      type: String,
      required: [true, "planName is required"],
      enum: ["Basic", "Standard", "Premium", "Elite", "Annual", "Student"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
