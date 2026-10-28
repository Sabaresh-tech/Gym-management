require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const {
  secureHeaders,
  apiRateLimiter,
  sanitizeMongoOperators,
  preventParamPollution,
} = require("./middleware/security");

const memberRoutes = require("./routes/memberRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const http = require("http");
const { Server } = require("socket.io");

const allowedOrigins = [
  "https://gym-management-jade.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:3000",
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((origin) => {
      if (!allowedOrigins.includes(origin)) allowedOrigins.push(origin);
    });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

const ChatMessage = require("./models/ChatMessage");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Middleware to authenticate socket connections if token is provided
io.use(async (socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    console.warn(`[Socket] Connection rejected: No authentication token provided`);
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn(`[Socket] Connection rejected: User not found`);
      return next(new Error("User not found"));
    }
    socket.user = user;
    next();
  } catch (err) {
    console.warn(`[Socket] Connection rejected: ${err.message}`);
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id} (User: ${socket.user.name}, Role: ${socket.user.role})`);

  // Join general room by default
  socket.join("general");

  // Room authorization and switching
  socket.on("joinRoom", (room) => {
    const targetRoom = room === "staff" ? "staff" : "general";

    if (targetRoom === "staff" && socket.user.role !== "admin" && socket.user.role !== "staff") {
      socket.emit("chatError", { message: "Unauthorized to join staff room" });
      return;
    }

    // Leave any previous chat room so client is strictly in target room
    for (const r of socket.rooms) {
      if (r !== socket.id && (r === "general" || r === "staff")) {
        socket.leave(r);
      }
    }

    socket.join(targetRoom);
    console.log(`[Socket] Client ${socket.id} (${socket.user.name}) joined room: ${targetRoom}`);
    socket.emit("roomJoined", { room: targetRoom });
  });

  socket.on("sendMessage", async (messageData, callback) => {
    try {
      if (!messageData || typeof messageData !== "object") {
        const errMsg = "Invalid message payload";
        socket.emit("chatError", { message: errMsg });
        if (typeof callback === "function") callback({ success: false, error: errMsg });
        return;
      }

      const text = (messageData.text || messageData.message || "").trim();
      if (!text) {
        const errMsg = "Message text cannot be empty";
        socket.emit("chatError", { message: errMsg });
        if (typeof callback === "function") callback({ success: false, error: errMsg });
        return;
      }

      if (text.length > 1000) {
        const errMsg = "Message cannot exceed 1000 characters";
        socket.emit("chatError", { message: errMsg });
        if (typeof callback === "function") callback({ success: false, error: errMsg });
        return;
      }

      const room = messageData.room === "staff" ? "staff" : "general";

      // Verify room permission before processing message
      if (room === "staff" && socket.user.role !== "admin" && socket.user.role !== "staff") {
        const errMsg = "Unauthorized to send messages in staff room";
        socket.emit("chatError", { message: errMsg });
        if (typeof callback === "function") callback({ success: false, error: errMsg });
        return;
      }

      // Ensure room is joined
      if (!socket.rooms.has(room)) {
        socket.join(room);
      }

      // Enforce sender identity from authenticated socket.user
      const senderName = socket.user.name;
      const senderRole = socket.user.role;
      const senderId = socket.user._id;

      // Validate and save to MongoDB before broadcasting
      const newMsg = await ChatMessage.create({
        sender: senderId,
        senderName: senderName,
        senderRole: senderRole,
        room: room,
        message: text,
      });

      console.log(`[Socket] Message saved: ${newMsg._id} in room '${room}' by ${senderName} (${senderRole})`);

      const broadcastData = {
        _id: newMsg._id,
        sender: newMsg.senderName,
        senderName: newMsg.senderName,
        role: newMsg.senderRole,
        senderRole: newMsg.senderRole,
        room: newMsg.room,
        text: newMsg.message,
        message: newMsg.message,
        timestamp: newMsg.createdAt,
        createdAt: newMsg.createdAt,
      };

      // Broadcast to room
      io.to(room).emit("receiveMessage", broadcastData);

      if (typeof callback === "function") {
        callback({ success: true, data: broadcastData });
      }
    } catch (err) {
      console.error("[Socket] Failed to save/send message:", err.message);
      socket.emit("chatError", { message: "Failed to save message: " + err.message });
      if (typeof callback === "function") {
        callback({ success: false, error: err.message });
      }
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);
  });
});

// Express sits behind a reverse proxy in most real deployments (Render,
// Vercel, nginx, etc.) — trust it so rate limiting sees the real client IP
// instead of the proxy's.
app.set("trust proxy", 1);

// --- Security & hardening middleware (Experiment No. 5) -----------------
app.use(secureHeaders);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Cap request body size — a JSON API for this data model never needs more
// than a few KB per request; this blocks oversized payload abuse early.
app.use(express.json({ limit: "10kb" }));

app.use(sanitizeMongoOperators);
app.use(preventParamPollution);

// Rate limiting only on the API surface (not on a future health/static
// route outside /api), so a demo hammering Postman doesn't need to worry
// about unrelated traffic.
app.use("/api", apiRateLimiter);

// --- Health check ------------------------------------------------------
// GET /api/health — quick way to confirm the API is up during a demo.
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Gym Management API is running" });
});

// --- Experiment No. 4 REST API routes -----------------------------------
app.use("/api/members", memberRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// --- 404 + centralized error handling -----------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening — the server should not
// start silently if the database connection fails.
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[Server] Gym Management API listening on http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
