const express = require("express");
const { getMessages } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/messages").get(protect, getMessages);

module.exports = router;
