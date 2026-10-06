const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    senderRole: {
      type: String,
      enum: ["admin", "staff", "member", "trainer"],
      required: [true, "Sender role is required"],
    },
    room: {
      type: String,
      enum: ["general", "staff"],
      default: "general",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
      maxlength: [1000, "Message is too long"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
