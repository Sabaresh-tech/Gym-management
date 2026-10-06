const ChatMessage = require("../models/ChatMessage");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get chat history
// @route   GET /api/chat/messages
// @access  Protected
const getMessages = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const room = req.query.room || "general";
  
  if (room === "staff" && req.user.role !== "admin" && req.user.role !== "staff") {
    res.status(403);
    throw new Error("Forbidden: Only admin and staff can access the staff room.");
  }
  
  const messages = await ChatMessage.find({ room })
    .sort({ createdAt: -1 })
    .limit(limit);
    
  // Return them in chronological order
  res.status(200).json({
    success: true,
    data: messages.reverse(),
  });
});

module.exports = {
  getMessages,
};
