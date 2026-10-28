const ChatMessage = require("../models/ChatMessage");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get chat history
// @route   GET /api/chat/messages
// @access  Protected
const getMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
  const room = req.query.room || "general";
  
  if (room === "staff" && req.user.role !== "admin" && req.user.role !== "staff") {
    res.status(403);
    throw new Error("Forbidden: Only admin and staff can access the staff room.");
  }
  
  // Support legacy chat messages without an explicit room field when in general
  const query = room === "general"
    ? { $or: [{ room: "general" }, { room: { $exists: false } }, { room: null }] }
    : { room };

  const messages = await ChatMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
    
  // Return them in chronological order
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages.reverse(),
  });
});

module.exports = {
  getMessages,
};
