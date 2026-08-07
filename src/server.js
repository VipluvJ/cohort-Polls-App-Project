import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Listen for socket connections
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// IMPORTANT: Start the HTTP server, not Express
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
