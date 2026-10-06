const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: [true, "memberId is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "date is required"],
      default: Date.now,
    },
    checkIn: {
      type: String, // stored as "HH:mm" for simple demo/display purposes
      required: [true, "checkIn is required"],
      trim: true,
    },
    checkOut: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["checked_in", "checked_out"],
      default: "checked_in",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
