import dotenv from "dotenv";
import http from "http";
import { initializeSocket } from "./sockets/socket.js";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = initializeSocket(server);

// Listen for socket connections
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("join-poll", (pollId) => {
    socket.join(pollId);

    io.to(pollId).emit("user-joined", {
      message: `${socket.id} joined the room`,
    });

    console.log(`${socket.id} joined room ${pollId}`);

    console.log(socket.rooms);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// IMPORTANT: Start the HTTP server, not Express
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
