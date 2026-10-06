const mongoose = require("mongoose");

// Reusable Mongoose connection. Reads MONGO_URI from environment variables
// (see .env.example) so credentials are never hard-coded in source.
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "\n[MongoDB] MONGO_URI is not set. Copy backend/.env.example to backend/.env and set MONGO_URI.\n"
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Fail fast (instead of the ~30s default) so a misconfigured/offline
      // database produces an immediate, readable error during a demo.
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    // Fail loudly and stop the server rather than starting silently with a
    // broken database connection.
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected.");
  });
}

module.exports = connectDB;
