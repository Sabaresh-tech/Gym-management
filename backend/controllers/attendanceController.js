const Attendance = require("../models/Attendance");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all attendance records
// @route   GET /api/attendance
const getAttendanceRecords = asyncHandler(async (req, res) => {
  const records = await Attendance.find().sort({ date: -1 });
  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Get a single attendance record by id
// @route   GET /api/attendance/:id
const getAttendanceById = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error("Attendance record not found");
  }
  res.status(200).json({ success: true, data: record });
});

// @desc    Create a new attendance record
// @route   POST /api/attendance
const createAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.create(req.body);
  res.status(201).json({ success: true, message: "Attendance record created successfully", data: record });
});

// @desc    Update an existing attendance record
// @route   PUT /api/attendance/:id
const updateAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!record) {
    res.status(404);
    throw new Error("Attendance record not found");
  }
  res.status(200).json({ success: true, message: "Attendance record updated successfully", data: record });
});

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
const deleteAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error("Attendance record not found");
  }
  res.status(200).json({ success: true, message: "Attendance record deleted successfully", data: record });
});

module.exports = {
  getAttendanceRecords,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
