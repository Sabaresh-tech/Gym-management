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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for the lab
    methods: ["GET", "POST"]
  }
});

const ChatMessage = require("./models/ChatMessage");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Middleware to authenticate socket connections if token is provided
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("User not found"));
    }
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id, `(User: ${socket.user.name}, Role: ${socket.user.role})`);
  
  // Room authorization
  socket.on("joinRoom", (room) => {
    if (room === "general") {
      socket.join("general");
    } else if (room === "staff") {
      if (socket.user.role === "admin" || socket.user.role === "staff") {
        socket.join("staff");
      } else {
        socket.emit("error", "Unauthorized to join staff room");
      }
    }
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      if (!messageData.text || messageData.text.trim() === "") return;
      const room = messageData.room || "general";
      
      // Verify room permission before processing message
      if (room === "staff" && socket.user.role !== "admin" && socket.user.role !== "staff") {
        return; // Unauthorized
      }

      // Enforce sender identity
      const senderName = socket.user.name;
      const senderRole = socket.user.role;
      const senderId = socket.user._id;
      
      const newMsg = await ChatMessage.create({
        sender: senderId,
        senderName: senderName,
        senderRole: senderRole,
        room: room,
        message: messageData.text.trim(),
      });
      
      const broadcastData = {
        _id: newMsg._id,
        sender: newMsg.senderName,
        role: newMsg.senderRole,
        room: newMsg.room,
        text: newMsg.message,
        timestamp: newMsg.createdAt,
      };
      
      io.to(room).emit("receiveMessage", broadcastData);
    } catch (err) {
      console.error("Error saving chat message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
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
    origin: "*",
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
