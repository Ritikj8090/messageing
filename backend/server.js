const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});
 
const PORT = 3001;
const users = {}; // Object to store user socket IDs by username (or custom identifier)
const socketUsers = {}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("register", (id) => {
    users[id] = socket.id; // Store socket ID for the given username
    socketUsers[socket.id] = id; // Store socket ID for the given username
    socket.emit("online", users)
    console.log(`User ${id} connected with socket ID: ${socket.id}`);
  });

  socket.on("sender", ({ from, to, message, createdAt }) => {
    io.to(users[to]).emit("receiver", { from, message, createdAt });
  });

  socket.on("disconnect", () => {
    delete users[socketUsers[socket.id]]
    socketUsers[socket.id]
    socket.emit("online", users)
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
