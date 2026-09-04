import dotenv from "dotenv";
import http from "http";

import app from "./app.production.js";
import { initializeSocket } from "./sockets/socket.production.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

const io = initializeSocket(server);

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("join-poll", (pollId) => {
    socket.join(pollId);

    io.to(pollId).emit("user-joined", {
      message: `${socket.id} joined the room`,
    });

    console.log(`${socket.id} joined room ${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Production server running on port ${PORT}`);
});
